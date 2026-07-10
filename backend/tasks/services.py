from django.db import transaction

from vendors.models import ServiceCategory

from ai_engine.services import get_orchestrator

from .constants import TaskStatus, UrgencyLevel
from .models import Task


def _resolve_category(category_slug: str | None) -> ServiceCategory | None:
    if not category_slug:
        return None
    # Quick fallback for AI variations
    fallback_map = {
        'plumber': 'plumbing',
        'electrician': 'electrical',
        'tailor': 'tailoring',
        'repair': 'powerloom-repair',
        'cleaner': 'house-cleaning',
        'painter': 'painting'
    }
    target_slug = fallback_map.get(category_slug.lower(), category_slug.lower())
    return ServiceCategory.objects.filter(slug=target_slug, is_active=True).first()


@transaction.atomic
def create_task_from_natural_language(
    *,
    customer,
    raw_user_input: str,
    locale: str = 'en',
    location: dict | None = None,
) -> Task:
    """
    Run AI intent pipeline and persist a structured Task for vendor matching.
    """
    task = Task.objects.create(
        customer=customer,
        raw_user_input=raw_user_input,
        locale=locale,
        location=location or {},
        status=TaskStatus.PENDING_PARSE,
    )

    orchestrator = get_orchestrator()
    parsed = orchestrator.parse_task_intent(
        raw_input=raw_user_input,
        locale=locale,
        location_hint=location,
        user=customer,
        service_task=task,
    )

    category = _resolve_category(parsed.category_slug)
    merged_location = {**parsed.location.to_dict(), **(location or {})}

    task.structured_output = parsed.to_dict()
    task.detected_category = category
    task.urgency = parsed.urgency if parsed.urgency in UrgencyLevel.values else UrgencyLevel.MEDIUM
    task.location = merged_location
    task.ai_confidence = parsed.confidence
    task.ai_provider = parsed.provider
    task.status = TaskStatus.PARSED
    task.save(
        update_fields=[
            'structured_output',
            'detected_category',
            'urgency',
            'location',
            'ai_confidence',
            'ai_provider',
            'status',
            'updated_at',
        ]
    )
    return task
