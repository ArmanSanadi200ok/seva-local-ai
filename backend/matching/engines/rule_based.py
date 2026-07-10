import logging
from django.db.models import QuerySet

from matching.engines.base import BaseMatchingEngine
from matching.scoring import ScoredVendor, score_vendor_for_task
from tasks.models import Task
from vendors.constants import AvailabilityStatus, VerificationStatus
from vendors.models import Vendor, ServiceCategory

from ..constants import MAX_CANDIDATES

logger = logging.getLogger(__name__)

def _normalize_category_alias(text: str) -> str:
    t = (text or '').lower()
    if any(x in t for x in ['cater', 'food', 'tiffin', 'lunch', 'veg', 'meal']): return 'catering'
    if any(x in t for x in ['plumb', 'leak', 'tap', 'pipe']): return 'plumbing'
    if any(x in t for x in ['tailor', 'stitch', 'uniform', 'blouse', 'alteration']): return 'tailoring'
    if any(x in t for x in ['machine', 'powerloom', 'motor', 'industrial', 'repair', 'belt']): return 'powerloom-repair'
    if any(x in t for x in ['decor', 'wedding', 'stage', 'event']): return 'decor'
    if any(x in t for x in ['clean', 'sweep']): return 'house-cleaning'
    if any(x in t for x in ['paint']): return 'painting'
    if any(x in t for x in ['electric', 'wir']): return 'electrical'
    return ''

class RuleBasedMatchingEngine(BaseMatchingEngine):
    name = 'rule_based'
    version = '1.0'

    def get_eligible_vendors(self, *, task: Task) -> list[Vendor]:
        qs = Vendor.objects.filter(
            is_active=True,
            verification_status=VerificationStatus.VERIFIED,
        ).exclude(availability_status=AvailabilityStatus.OFFLINE).select_related('category', 'user')

        city = (task.location or {}).get('city', 'Ichalkaranji')
        if city:
            qs = qs.filter(city__iexact=city.strip())
            
        all_vendors = list(qs)
        
        # 1) Canonical category normalization
        task_cat_id = task.detected_category_id
        if not task_cat_id:
            raw = task.raw_user_input or ''
            slug = _normalize_category_alias(raw)
            if slug:
                cat = ServiceCategory.objects.filter(slug=slug).first()
                if cat:
                    task_cat_id = cat.id
                    task.detected_category_id = cat.id  # Cache for scoring logic

        # 2) Phase A: Exact / compatible category pool
        if task_cat_id:
            primary_pool = [v for v in all_vendors if v.category_id == task_cat_id]
            if primary_pool:
                logger.info(f"[MATCHING] Phase A: Found {len(primary_pool)} primary vendors for category {task_cat_id}")
                return primary_pool
                
            logger.warning(f"[MATCHING] Fallback used. No primary vendors for category {task_cat_id}. Returning {len(all_vendors)} active vendors.")
        else:
            logger.warning(f"[MATCHING] Generic task. No category inferred. Returning {len(all_vendors)} active vendors.")
            
        return all_vendors

    def score_candidates(self, *, task: Task) -> list[ScoredVendor]:
        vendors = self.get_eligible_vendors(task=task)
        
        # 3) Score Phase C
        scored = [score_vendor_for_task(vendor=v, task=task) for v in vendors]
        
        # 4) Category mismatch penalty (Exclude unrelated from top matches)
        task_cat_id = task.detected_category_id
        if task_cat_id:
            for s in scored:
                if s.vendor.category_id != task_cat_id:
                    s.total_score -= 50  # Severe penalty
                    
        scored.sort(key=lambda item: item.total_score, reverse=True)
        
        # Exclude heavily penalized vendors
        valid_matches = [s for s in scored if s.total_score > 0]
        
        logger.info(f"[MATCHING] Final valid matches: {len(valid_matches)} (Top vendors: {[s.vendor.business_name for s in valid_matches[:3]]})")
        return valid_matches[:MAX_CANDIDATES]
