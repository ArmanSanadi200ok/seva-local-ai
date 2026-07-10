import logging
import time

from django.conf import settings

from ai_engine.constants import (
    AIProviderKind,
    AIRequestStatus,
    PipelineName,
    STRUCTURED_OUTPUT_SCHEMA_VERSION,
)
from ai_engine.dto import ParsedTaskDTO
from ai_engine.exceptions import AIEngineError
from ai_engine.models import AIRequestLog
from ai_engine.pipelines import TaskIntentParserPipeline
from ai_engine.providers import StubLLMProvider
from ai_engine.providers.base import BaseLLMProvider
from ai_engine.providers.gemini import GeminiLLMProvider

logger = logging.getLogger(__name__)


def _gemini_configured() -> bool:
    return bool(getattr(settings, 'GEMINI_API_KEY', ''))


def _should_use_gemini() -> bool:
    provider = getattr(settings, 'AI_PROVIDER', AIProviderKind.STUB)
    return provider == AIProviderKind.GEMINI and _gemini_configured()


def _fallback_enabled() -> bool:
    return getattr(settings, 'AI_FALLBACK_TO_STUB', True)


def get_orchestrator() -> 'AIOrchestrator':
    """Factory (not cached) so tests can swap settings."""
    return AIOrchestrator()


class AIOrchestrator:
    """Single entry point for all LLM operations in Ichalkaranji Seva."""

    def __init__(self, provider: BaseLLMProvider | None = None) -> None:
        self.provider = provider or self._build_primary_provider()
        self.fallback_provider = StubLLMProvider()

    def _build_primary_provider(self) -> BaseLLMProvider:
        if _should_use_gemini():
            return GeminiLLMProvider()
        if getattr(settings, 'AI_PROVIDER', '') == AIProviderKind.GEMINI and not _gemini_configured():
            logger.warning('AI_PROVIDER=gemini but GEMINI_API_KEY missing; using stub.')
        return StubLLMProvider()

    def parse_task_intent(
        self,
        *,
        raw_input: str,
        locale: str = 'en',
        location_hint: dict | None = None,
        user=None,
        service_task=None,
    ) -> ParsedTaskDTO:
        started = time.perf_counter()
        status = AIRequestStatus.SUCCESS
        error_message = ''
        result: ParsedTaskDTO | None = None
        effective_provider = self.provider.name
        tokens_used = 0
        fallback_used = False
        primary_error = ''

        try:
            try:
                result = self._run_pipeline(
                    provider=self.provider,
                    raw_input=raw_input,
                    locale=locale,
                    location_hint=location_hint,
                )
                effective_provider = result.provider
                tokens_used = int(result.raw_response.get('tokens_used', 0))
            except (AIEngineError, Exception) as exc:
                primary_error = str(exc)
                logger.warning(
                    'Primary AI provider failed (%s): %s',
                    self.provider.name,
                    exc,
                )
                if _fallback_enabled() and self.provider.name != self.fallback_provider.name:
                    fallback_used = True
                    effective_provider = self.fallback_provider.name
                    result = self._run_pipeline(
                        provider=self.fallback_provider,
                        raw_input=raw_input,
                        locale=locale,
                        location_hint=location_hint,
                    )
                    result.raw_response['fallback_from'] = self.provider.name
                    result.raw_response['primary_error'] = primary_error
                else:
                    status = AIRequestStatus.FAILED
                    error_message = primary_error
                    raise

            if result:
                result.raw_response['schema_version'] = STRUCTURED_OUTPUT_SCHEMA_VERSION
                if fallback_used:
                    result.raw_response['fallback_used'] = True

            return result

        except Exception:
            if status != AIRequestStatus.FAILED:
                status = AIRequestStatus.FAILED
                error_message = error_message or primary_error or 'Unknown AI error'
            raise
        finally:
            latency_ms = int((time.perf_counter() - started) * 1000)
            AIRequestLog.objects.create(
                user=user,
                service_task=service_task,
                pipeline=PipelineName.TASK_INTENT_PARSER,
                provider=effective_provider,
                locale=locale,
                raw_input=raw_input,
                structured_output=result.to_dict() if result else {},
                status=status,
                error_message=error_message,
                latency_ms=latency_ms,
                tokens_used=tokens_used,
            )

    def _run_pipeline(
        self,
        *,
        provider: BaseLLMProvider,
        raw_input: str,
        locale: str,
        location_hint: dict | None,
    ) -> ParsedTaskDTO:
        pipeline = TaskIntentParserPipeline(provider)
        return pipeline.run(
            raw_input=raw_input,
            locale=locale,
            location_hint=location_hint,
        )
