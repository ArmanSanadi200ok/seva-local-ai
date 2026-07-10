from dataclasses import dataclass, field
from decimal import Decimal
from typing import Any

from tasks.models import Task
from vendors.constants import AvailabilityStatus
from vendors.models import Vendor

from .constants import (
    WEIGHT_AREA,
    WEIGHT_AVAILABILITY,
    WEIGHT_CATEGORY,
    WEIGHT_CITY,
    WEIGHT_RATING,
    WEIGHT_SUBCATEGORY,
)


@dataclass
class ScoredVendor:
    vendor: Vendor
    total_score: Decimal
    breakdown: dict[str, Any] = field(default_factory=dict)
    ai_score: Decimal | None = None


def _normalize_text(value: str) -> str:
    return (value or '').strip().lower()


def _task_subcategory(task: Task) -> str:
    if not task.structured_output:
        return ''
    return _normalize_text(task.structured_output.get('subcategory', ''))


def _task_city(task: Task) -> str:
    return _normalize_text((task.location or {}).get('city', 'Ichalkaranji'))


def _task_area(task: Task) -> str:
    return _normalize_text((task.location or {}).get('area', ''))


def score_vendor_for_task(*, vendor: Vendor, task: Task) -> ScoredVendor:
    """Rule-based scoring (0–100). AI layer can adjust ``ai_score`` later."""
    breakdown: dict[str, float] = {}

    # Category
    if task.detected_category_id and vendor.category_id == task.detected_category_id:
        breakdown['category'] = float(WEIGHT_CATEGORY)
    elif task.detected_category_id is None:
        breakdown['category'] = float(WEIGHT_CATEGORY) * 0.3
    else:
        breakdown['category'] = 0.0

    # Subcategory (partial text match)
    task_sub = _task_subcategory(task)
    vendor_sub = _normalize_text(vendor.subcategory)
    if task_sub and vendor_sub and (task_sub in vendor_sub or vendor_sub in task_sub):
        breakdown['subcategory'] = float(WEIGHT_SUBCATEGORY)
    elif not task_sub:
        breakdown['subcategory'] = float(WEIGHT_SUBCATEGORY) * 0.5
    else:
        breakdown['subcategory'] = 0.0

    # City
    if _task_city(task) == _normalize_text(vendor.city):
        breakdown['city'] = float(WEIGHT_CITY)
    else:
        breakdown['city'] = 0.0

    # Area / locality
    task_area = _task_area(task)
    vendor_area = _normalize_text(vendor.area)
    if task_area and vendor_area and (task_area in vendor_area or vendor_area in task_area):
        breakdown['area'] = float(WEIGHT_AREA)
    elif not task_area:
        breakdown['area'] = float(WEIGHT_AREA) * 0.4
    else:
        breakdown['area'] = 0.0

    # Availability
    if vendor.availability_status == AvailabilityStatus.AVAILABLE:
        breakdown['availability'] = float(WEIGHT_AVAILABILITY)
    elif vendor.availability_status == AvailabilityStatus.BUSY:
        breakdown['availability'] = float(WEIGHT_AVAILABILITY) * 0.5
    else:
        breakdown['availability'] = 0.0

    # Rating (0–5 → weight)
    rating = float(vendor.rating or 0)
    breakdown['rating'] = round((rating / 5.0) * WEIGHT_RATING, 2)

    # Response priority boost from task urgency
    urgency = getattr(task, 'urgency', 'medium')
    urgency_boost = {
        'emergency': 5.0,
        'high': 3.0,
        'medium': 1.0,
        'low': 0.0,
    }.get(urgency, 1.0)
    breakdown['urgency_boost'] = urgency_boost

    total = Decimal(str(round(sum(breakdown.values()), 2)))
    total = min(total, Decimal('100.00'))

    return ScoredVendor(vendor=vendor, total_score=total, breakdown=breakdown)
