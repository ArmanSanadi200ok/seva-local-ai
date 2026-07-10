from django.db.models import QuerySet

from .models import Match, MatchRun


def get_latest_match_run(*, task_id: int) -> MatchRun | None:
    return MatchRun.objects.filter(task_id=task_id).order_by('-created_at').first()


def get_matches_for_task(*, task_id: int, recommended_only: bool = True) -> QuerySet[Match]:
    qs = Match.objects.filter(task_id=task_id).select_related(
        'vendor',
        'vendor__category',
        'match_run',
    )
    if recommended_only:
        qs = qs.filter(is_recommended=True)
    return qs.order_by('rank')


def get_matches_for_latest_run(*, task_id: int) -> QuerySet[Match]:
    run = get_latest_match_run(task_id=task_id)
    if not run:
        return Match.objects.none()
    return get_matches_for_task(task_id=task_id).filter(match_run=run)
