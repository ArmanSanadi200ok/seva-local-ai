from vendors.models import ServiceCategory

from ai_engine.dto import ParsedTaskDTO
from ai_engine.parsers import parse_gemini_task_response
from ai_engine.services.gemini_service import GeminiService

from .base import BaseLLMProvider


class GeminiLLMProvider(BaseLLMProvider):
    """Production parser using Google Gemini structured JSON output."""

    name = 'gemini'
    version = '1.0'

    def __init__(self) -> None:
        self._service = GeminiService()

    def _active_category_slugs(self) -> list[str]:
        return list(
            ServiceCategory.objects.filter(is_active=True).values_list('slug', flat=True)
        )

    def parse_task_intent(
        self,
        *,
        raw_input: str,
        locale: str,
        location_hint: dict | None = None,
    ) -> ParsedTaskDTO:
        slugs = self._active_category_slugs()
        payload, metadata = self._service.parse_task_intent(
            raw_input=raw_input,
            locale=locale,
            location_hint=location_hint,
            category_slugs=slugs,
        )
        return parse_gemini_task_response(
            payload=payload,
            raw_input=raw_input,
            locale=locale,
            location_hint=location_hint,
            category_slugs=set(slugs),
            raw_response_meta=metadata,
        )
