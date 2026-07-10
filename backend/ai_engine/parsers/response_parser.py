"""
Validate and normalize Gemini JSON into pipeline DTOs.
"""

from typing import Any

from ai_engine.constants import STRUCTURED_OUTPUT_SCHEMA_VERSION
from ai_engine.dto import ParsedLocationDTO, ParsedTaskDTO
from ai_engine.exceptions import GeminiParseError

_VALID_URGENCY = frozenset({'low', 'medium', 'high', 'emergency'})


def parse_gemini_task_response(
    *,
    payload: dict[str, Any],
    raw_input: str,
    locale: str,
    location_hint: dict | None,
    category_slugs: set[str],
    raw_response_meta: dict[str, Any],
) -> ParsedTaskDTO:
    if not isinstance(payload, dict):
        raise GeminiParseError('Gemini response is not a JSON object.')

    title = str(payload.get('title') or '').strip()
    if not title:
        title = raw_input.strip()[:120]

    description = str(payload.get('description') or raw_input).strip()

    category_slug = payload.get('category_slug')
    if category_slug is not None:
        category_slug = str(category_slug).strip().lower() or None
        if category_slug and category_slug not in category_slugs:
            category_slug = None

    subcategory = str(payload.get('subcategory') or '').strip()

    urgency = str(payload.get('urgency') or 'medium').lower().strip()
    if urgency not in _VALID_URGENCY:
        urgency = 'medium'

    loc_payload = payload.get('location') if isinstance(payload.get('location'), dict) else {}
    hint = location_hint or {}
    location = ParsedLocationDTO(
        city=str(loc_payload.get('city') or hint.get('city') or 'Ichalkaranji').strip(),
        area=str(loc_payload.get('area') or hint.get('area') or '').strip(),
        address=str(loc_payload.get('address') or hint.get('address') or '').strip(),
        latitude=hint.get('latitude'),
        longitude=hint.get('longitude'),
    )

    try:
        confidence = float(payload.get('confidence', 0.7))
    except (TypeError, ValueError):
        confidence = 0.7
    confidence = max(0.0, min(1.0, confidence))

    keywords_raw = payload.get('keywords') or []
    keywords = [str(k).strip() for k in keywords_raw if k][:10] if isinstance(keywords_raw, list) else []

    return ParsedTaskDTO(
        title=title,
        description=description,
        category_slug=category_slug,
        subcategory=subcategory,
        urgency=urgency,
        location=location,
        confidence=confidence,
        locale=locale,
        schema_version=STRUCTURED_OUTPUT_SCHEMA_VERSION,
        keywords=keywords,
        provider='gemini',
        raw_response=raw_response_meta,
    )
