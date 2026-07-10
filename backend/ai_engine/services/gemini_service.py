"""
Dedicated Google Gemini API client for Ichalkaranji Seva.
API key is read from Django settings only — never from client requests.
"""

import json
import logging
import time
from typing import Any

from django.conf import settings

from ai_engine.exceptions import GeminiAPIError, GeminiConfigurationError
from ai_engine.prompts import build_task_intent_prompt

logger = logging.getLogger(__name__)


class GeminiService:
    """Thin wrapper around the Google Generative AI SDK."""

    def __init__(self) -> None:
        api_key = getattr(settings, 'GEMINI_API_KEY', '')
        if not api_key:
            raise GeminiConfigurationError(
                'GEMINI_API_KEY is not set. Add it to .env or use AI_PROVIDER=stub.'
            )
        self._api_key = api_key
        self._model_name = getattr(settings, 'GEMINI_MODEL', 'gemini-2.0-flash')
        self._timeout = int(getattr(settings, 'GEMINI_TIMEOUT_SECONDS', 30))

    def _get_model(self):
        import google.generativeai as genai

        genai.configure(api_key=self._api_key)
        return genai.GenerativeModel(
            model_name=self._model_name,
            generation_config={
                'temperature': float(getattr(settings, 'GEMINI_TEMPERATURE', 0.2)),
                'response_mime_type': 'application/json',
            },
        )

    def parse_task_intent(
        self,
        *,
        raw_input: str,
        locale: str,
        location_hint: dict | None,
        category_slugs: list[str],
    ) -> tuple[dict[str, Any], dict[str, Any]]:
        """
        Call Gemini and return (parsed_json_dict, metadata_for_logging).
        """
        prompt = build_task_intent_prompt(
            raw_input=raw_input,
            locale=locale,
            location_hint=location_hint,
            category_slugs=category_slugs,
        )

        started = time.perf_counter()
        try:
            model = self._get_model()
            response = model.generate_content(
                prompt,
                request_options={'timeout': self._timeout},
            )
        except Exception as exc:
            logger.exception('Gemini API request failed')
            raise GeminiAPIError(f'Gemini API error: {exc}') from exc

        latency_ms = int((time.perf_counter() - started) * 1000)
        text = getattr(response, 'text', None) or ''
        if not text.strip():
            raise GeminiAPIError('Gemini returned an empty response.')

        try:
            payload = json.loads(text)
        except json.JSONDecodeError as exc:
            logger.error('Invalid JSON from Gemini: %s', text[:500])
            raise GeminiAPIError('Gemini response was not valid JSON.') from exc

        tokens_used = 0
        usage = getattr(response, 'usage_metadata', None)
        if usage is not None:
            tokens_used = int(
                getattr(usage, 'total_token_count', 0)
                or (
                    getattr(usage, 'prompt_token_count', 0)
                    + getattr(usage, 'candidates_token_count', 0)
                )
            )

        metadata = {
            'engine': 'gemini',
            'model': self._model_name,
            'latency_ms': latency_ms,
            'tokens_used': tokens_used,
        }
        logger.debug(
            'Gemini parse success model=%s latency_ms=%s tokens=%s',
            self._model_name,
            latency_ms,
            tokens_used,
        )
        return payload, metadata
