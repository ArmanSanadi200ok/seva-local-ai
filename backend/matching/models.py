from django.db import models

from .constants import MatchEngineKind, MatchRunStatus


class MatchRun(models.Model):
    """Audit record for each matching execution on a task."""

    task = models.ForeignKey(
        'tasks.Task',
        on_delete=models.CASCADE,
        related_name='match_runs',
    )
    engine = models.CharField(
        max_length=32,
        choices=MatchEngineKind.choices,
        default=MatchEngineKind.RULE_BASED,
    )
    engine_version = models.CharField(max_length=20, default='1.0')
    status = models.CharField(
        max_length=20,
        choices=MatchRunStatus.choices,
        default=MatchRunStatus.RUNNING,
        db_index=True,
    )
    candidate_count = models.PositiveIntegerField(default=0)
    metadata = models.JSONField(default=dict, blank=True)
    error_message = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['task', 'created_at']),
        ]

    def __str__(self) -> str:
        return f'MatchRun #{self.pk} task={self.task_id} ({self.engine})'


class Match(models.Model):
    """
    Ranked vendor candidate for a task (snapshot at match time).
    """

    match_run = models.ForeignKey(
        MatchRun,
        on_delete=models.CASCADE,
        related_name='matches',
    )
    task = models.ForeignKey(
        'tasks.Task',
        on_delete=models.CASCADE,
        related_name='vendor_matches',
    )
    vendor = models.ForeignKey(
        'vendors.Vendor',
        on_delete=models.CASCADE,
        related_name='task_matches',
    )
    rank = models.PositiveSmallIntegerField(db_index=True)
    total_score = models.DecimalField(max_digits=5, decimal_places=2)
    score_breakdown = models.JSONField(
        default=dict,
        blank=True,
        help_text='Per-factor scores for transparency and AI tuning.',
    )
    ai_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Reserved for future ML/AI re-ranking (0–100).',
    )
    is_recommended = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['rank']
        constraints = [
            models.UniqueConstraint(
                fields=['match_run', 'vendor'],
                name='unique_vendor_per_match_run',
            ),
        ]
        indexes = [
            models.Index(fields=['task', 'rank']),
            models.Index(fields=['task', '-total_score']),
        ]

    def __str__(self) -> str:
        return f'Match task={self.task_id} vendor={self.vendor_id} rank={self.rank}'
