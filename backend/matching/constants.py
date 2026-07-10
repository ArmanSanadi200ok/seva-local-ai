from django.db import models

# Scoring weights (sum = 100). AI engine may override via ai_score later.
WEIGHT_CATEGORY = 30
WEIGHT_SUBCATEGORY = 15
WEIGHT_CITY = 20
WEIGHT_AREA = 15
WEIGHT_AVAILABILITY = 10
WEIGHT_RATING = 10

MAX_CANDIDATES = 20

DEFAULT_ENGINE_VERSION = '1.0'


class MatchEngineKind(models.TextChoices):
    RULE_BASED = 'rule_based', 'Rule based'
    AI = 'ai', 'AI ranking'


class MatchRunStatus(models.TextChoices):
    RUNNING = 'running', 'Running'
    SUCCESS = 'success', 'Success'
    FAILED = 'failed', 'Failed'
