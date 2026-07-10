from django.conf import settings
from django.db import transaction

from matching.constants import (
    DEFAULT_ENGINE_VERSION,
    MatchEngineKind,
    MatchRunStatus,
)
from matching.engines.ai_ranker import AIRankingEngine
from matching.engines.rule_based import RuleBasedMatchingEngine
from matching.models import Match, MatchRun
from tasks.constants import TaskStatus
from tasks.models import Task


class MatchingError(Exception):
    """Base matching service error."""


class TaskNotReadyForMatchingError(MatchingError):
    pass


def _get_engine():
    engine_name = getattr(settings, 'MATCHING_ENGINE', MatchEngineKind.RULE_BASED)
    if engine_name == MatchEngineKind.AI:
        return AIRankingEngine()
    return RuleBasedMatchingEngine()


@transaction.atomic
def run_matching_for_task(*, task: Task) -> MatchRun:
    """
    Score vendors, persist Match rows, update task status.
    Callable after publish or via explicit API.
    """
    allowed_statuses = {TaskStatus.PUBLISHED, TaskStatus.MATCHING, TaskStatus.MATCHED}
    if task.status not in allowed_statuses:
        raise TaskNotReadyForMatchingError(
            f'Task must be published before matching. Current status: {task.status}'
        )

    engine = _get_engine()
    match_run = MatchRun.objects.create(
        task=task,
        engine=engine.name,
        engine_version=getattr(engine, 'version', DEFAULT_ENGINE_VERSION),
        status=MatchRunStatus.RUNNING,
        metadata={
            'urgency': task.urgency,
            'category_id': task.detected_category_id,
            'location': task.location,
        },
    )

    task.status = TaskStatus.MATCHING
    task.save(update_fields=['status', 'updated_at'])

    try:
        scored = engine.score_candidates(task=task)
        matches = []
        for rank, item in enumerate(scored, start=1):
            matches.append(
                Match(
                    match_run=match_run,
                    task=task,
                    vendor=item.vendor,
                    rank=rank,
                    total_score=item.total_score,
                    score_breakdown=item.breakdown,
                    ai_score=item.ai_score,
                    is_recommended=rank <= 10,
                )
            )
        Match.objects.bulk_create(matches)

        match_run.candidate_count = len(matches)
        match_run.status = MatchRunStatus.SUCCESS
        match_run.save(update_fields=['candidate_count', 'status'])

        task.status = TaskStatus.MATCHED if matches else TaskStatus.PUBLISHED
        task.save(update_fields=['status', 'updated_at'])
        return match_run

    except Exception as exc:
        match_run.status = MatchRunStatus.FAILED
        match_run.error_message = str(exc)
        match_run.save(update_fields=['status', 'error_message'])
        task.status = TaskStatus.PUBLISHED
        task.save(update_fields=['status', 'updated_at'])
        raise
