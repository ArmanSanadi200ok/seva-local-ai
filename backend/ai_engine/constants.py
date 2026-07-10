from django.db import models

# Supported locales today; Marathi pipeline hooks ready for Gemini phase.
SUPPORTED_LOCALES = frozenset({'en', 'mr'})

DEFAULT_LOCALE = 'en'

STRUCTURED_OUTPUT_SCHEMA_VERSION = '1.0'


class AIProviderKind(models.TextChoices):
    STUB = 'stub', 'Stub (rules)'
    GEMINI = 'gemini', 'Google Gemini'


class AIRequestStatus(models.TextChoices):
    SUCCESS = 'success', 'Success'
    FAILED = 'failed', 'Failed'


class PipelineName(models.TextChoices):
    TASK_INTENT_PARSER = 'task_intent_parser', 'Task intent parser'
