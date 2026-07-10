from ai_engine.constants import SUPPORTED_LOCALES
from ai_engine.dto import ParsedTaskDTO
from ai_engine.providers.base import BaseLLMProvider


class TaskIntentParserPipeline:
    """Orchestrates provider call + locale normalization for task intents."""

    pipeline_name = 'task_intent_parser'

    def __init__(self, provider: BaseLLMProvider) -> None:
        self.provider = provider

    def run(
        self,
        *,
        raw_input: str,
        locale: str = 'en',
        location_hint: dict | None = None,
    ) -> ParsedTaskDTO:
        if not raw_input or not raw_input.strip():
            raise ValueError('raw_input is required.')

        normalized_locale = locale.lower().split('-')[0]
        if normalized_locale not in SUPPORTED_LOCALES:
            normalized_locale = 'en'

        result = self.provider.parse_task_intent(
            raw_input=raw_input.strip(),
            locale=normalized_locale,
            location_hint=location_hint,
        )
        result.locale = normalized_locale
        return result
