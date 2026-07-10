"""
Prompt templates for task intent parsing.
Locale-aware (English + Marathi input); JSON keys remain English for API stability.
"""

import json


def build_task_intent_prompt(
    *,
    raw_input: str,
    locale: str,
    location_hint: dict | None,
    category_slugs: list[str],
) -> str:
    location_hint = location_hint or {}
    categories_json = json.dumps(category_slugs)

    language_instruction = (
        'The user may write in Marathi, Hindi, or English. Understand all languages.'
        if locale == 'mr'
        else 'The user may write in Marathi, Hindi, or English. Understand all languages.'
    )

    return f"""You are an AI assistant for Ichalkaranji Seva, a hyperlocal service marketplace in Ichalkaranji, Maharashtra, India.

{language_instruction}
Extract a structured service request from the user message below.

Allowed category_slug values (use null if unclear): {categories_json}
Allowed urgency values: low, medium, high, emergency

Location hint from client (may be partial): {json.dumps(location_hint)}

Respond with ONLY valid JSON matching this exact schema (no markdown):
{{
  "title": "short summary max 120 chars",
  "description": "full user request in original language",
  "category_slug": "slug from allowed list or null",
  "subcategory": "specific service type string or empty",
  "urgency": "low|medium|high|emergency",
  "location": {{
    "city": "default Ichalkaranji if unknown",
    "area": "locality/neighborhood",
    "address": "optional detail"
  }},
  "confidence": 0.0 to 1.0,
  "keywords": ["up to 10 relevant keywords"]
}}

User message:
\"\"\"{raw_input}\"\"\"
"""
