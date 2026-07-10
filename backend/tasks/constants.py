from django.db import models


class TaskStatus(models.TextChoices):
    PENDING_PARSE = 'pending_parse', 'Pending parse'
    PARSED = 'parsed', 'Parsed'
    PUBLISHED = 'published', 'Published'
    MATCHING = 'matching', 'Matching'
    MATCHED = 'matched', 'Matched'
    IN_PROGRESS = 'in_progress', 'In progress'
    COMPLETED = 'completed', 'Completed'
    CANCELLED = 'cancelled', 'Cancelled'


class UrgencyLevel(models.TextChoices):
    LOW = 'low', 'Low'
    MEDIUM = 'medium', 'Medium'
    HIGH = 'high', 'High'
    EMERGENCY = 'emergency', 'Emergency'
