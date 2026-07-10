from abc import ABC, abstractmethod

from ai_engine.dto import ParsedTaskDTO


class BaseLLMProvider(ABC):
    """Contract for LLM backends (stub, Gemini, etc.)."""

    name: str = 'base'

    @abstractmethod
    def parse_task_intent(
        self,
        *,
        raw_input: str,
        locale: str,
        location_hint: dict | None = None,
    ) -> ParsedTaskDTO:
        """Convert natural language into structured task intent."""
