from abc import ABC, abstractmethod

from matching.scoring import ScoredVendor
from tasks.models import Task


class BaseMatchingEngine(ABC):
    """Pluggable matcher (rule-based today, AI re-rank tomorrow)."""

    name: str = 'base'
    version: str = '1.0'

    @abstractmethod
    def score_candidates(self, *, task: Task) -> list[ScoredVendor]:
        """Return vendors scored and sorted best-first."""
