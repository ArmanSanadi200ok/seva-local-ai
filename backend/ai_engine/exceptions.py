class AIEngineError(Exception):
    """Base AI engine error."""


class GeminiConfigurationError(AIEngineError):
    """Gemini API key or settings missing."""


class GeminiAPIError(AIEngineError):
    """Gemini API call failed."""


class GeminiParseError(AIEngineError):
    """Could not parse or validate Gemini JSON response."""
