from django.conf import settings
from django.db import models

from .constants import AIProviderKind, AIRequestStatus, PipelineName


class AIRequestLog(models.Model):
    """Audit log for AI calls (stub today, Gemini tomorrow)."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='ai_request_logs',
    )
    service_task = models.ForeignKey(
        'tasks.Task',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='ai_logs',
    )
    pipeline = models.CharField(max_length=64, choices=PipelineName.choices)
    provider = models.CharField(max_length=32, choices=AIProviderKind.choices)
    locale = models.CharField(max_length=10, default='en')
    raw_input = models.TextField()
    structured_output = models.JSONField(default=dict, blank=True)
    status = models.CharField(
        max_length=20,
        choices=AIRequestStatus.choices,
        default=AIRequestStatus.SUCCESS,
    )
    error_message = models.TextField(blank=True, default='')
    latency_ms = models.PositiveIntegerField(default=0)
    tokens_used = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['pipeline', 'created_at']),
            models.Index(fields=['user', 'created_at']),
        ]

    def __str__(self) -> str:
        return f'{self.pipeline} ({self.provider}) @ {self.created_at:%Y-%m-%d %H:%M}'
