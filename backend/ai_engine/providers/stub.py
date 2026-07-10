import re
import time

from ai_engine.constants import DEFAULT_LOCALE
from ai_engine.dto import ParsedLocationDTO, ParsedTaskDTO

from .base import BaseLLMProvider

# Keyword → category slug (expandable; Gemini will replace this logic).
_CATEGORY_KEYWORDS: dict[str, list[str]] = {
    'plumbing': ['pipe', 'leak', 'tap', 'plumb', 'water', 'नळ', 'पाइप'],
    'electrical': ['wire', 'electric', 'fan', 'light', 'switch', 'वीज', 'करंट'],
    'carpentry': ['wood', 'door', 'furniture', 'carpent', 'लाकूड'],
    'cleaning': ['clean', 'sweep', 'wash', 'साफ'],
    'appliance-repair': ['fridge', 'ac', 'washing', 'repair', 'रिपेअर'],
}

_URGENCY_KEYWORDS: dict[str, list[str]] = {
    'emergency': ['urgent', 'emergency', 'immediately', 'आता', 'तातडी'],
    'high': ['asap', 'soon', 'today', 'लवकर'],
    'low': ['later', 'no rush', 'नंतर'],
}


class StubLLMProvider(BaseLLMProvider):
    """
    Rule-based placeholder parser.
    Mirrors the future Gemini pipeline interface without external API calls.
    """

    name = 'stub'

    def parse_task_intent(
        self,
        *,
        raw_input: str,
        locale: str,
        location_hint: dict | None = None,
    ) -> ParsedTaskDTO:
        started = time.perf_counter()
        text = raw_input.strip()
        lowered = text.lower()

        category_slug = self._detect_category(lowered)
        urgency = self._detect_urgency(lowered)
        location = self._build_location(location_hint)
        title = self._build_title(text)
        keywords = self._extract_keywords(lowered)

        elapsed_ms = int((time.perf_counter() - started) * 1000)

        return ParsedTaskDTO(
            title=title,
            description=text,
            category_slug=category_slug,
            subcategory='',
            urgency=urgency,
            location=location,
            confidence=0.55 if category_slug else 0.35,
            locale=locale or DEFAULT_LOCALE,
            keywords=keywords,
            provider=self.name,
            raw_response={
                'engine': 'stub',
                'latency_ms': elapsed_ms,
                'matched_category': category_slug,
            },
        )

    def _detect_category(self, lowered: str) -> str | None:
        for slug, words in _CATEGORY_KEYWORDS.items():
            if any(word in lowered for word in words):
                return slug
        return None

    def _detect_urgency(self, lowered: str) -> str:
        for level, words in _URGENCY_KEYWORDS.items():
            if any(word in lowered for word in words):
                return level
        return 'medium'

    def _build_location(self, location_hint: dict | None) -> ParsedLocationDTO:
        hint = location_hint or {}
        return ParsedLocationDTO(
            city=hint.get('city') or 'Ichalkaranji',
            area=hint.get('area', ''),
            address=hint.get('address', ''),
            latitude=hint.get('latitude'),
            longitude=hint.get('longitude'),
        )

    def _build_title(self, text: str) -> str:
        sentence = re.split(r'[.!?\n]', text.strip())[0]
        return (sentence[:120] + '…') if len(sentence) > 120 else sentence

    def _extract_keywords(self, lowered: str) -> list[str]:
        tokens = re.findall(r'[a-zA-Z\u0900-\u097F]{3,}', lowered)
        return list(dict.fromkeys(tokens))[:10]
