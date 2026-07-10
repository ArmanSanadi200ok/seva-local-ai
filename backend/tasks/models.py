from django.conf import settings
from django.db import models

from vendors.models import ServiceCategory

from .constants import TaskStatus, UrgencyLevel


class Task(models.Model):
    """
    Customer service request produced from natural language + AI structuring.
    """

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='service_tasks',
    )
    raw_user_input = models.TextField(help_text='Original natural language request.')
    structured_output = models.JSONField(
        default=dict,
        blank=True,
        help_text='Normalized AI pipeline output (versioned schema).',
    )
    detected_category = models.ForeignKey(
        ServiceCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tasks',
    )
    urgency = models.CharField(
        max_length=20,
        choices=UrgencyLevel.choices,
        default=UrgencyLevel.MEDIUM,
        db_index=True,
    )
    location = models.JSONField(
        default=dict,
        blank=True,
        help_text='{"city","area","address","latitude","longitude"}',
    )
    locale = models.CharField(
        max_length=10,
        default='en',
        db_index=True,
        help_text='BCP-47 language code (en, mr).',
    )
    status = models.CharField(
        max_length=20,
        choices=TaskStatus.choices,
        default=TaskStatus.PENDING_PARSE,
        db_index=True,
    )
    ai_confidence = models.DecimalField(
        max_digits=4,
        decimal_places=3,
        null=True,
        blank=True,
        help_text='0.000–1.000 confidence from AI parser.',
    )
    ai_provider = models.CharField(max_length=50, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['customer', 'status']),
            models.Index(fields=['status', 'urgency']),
            models.Index(fields=['locale', 'created_at']),
        ]

    def __str__(self) -> str:
        title = self.structured_output.get('title') if self.structured_output else ''
        return title or f'Task #{self.pk}'
