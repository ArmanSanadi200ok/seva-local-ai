from matching.engines.base import BaseMatchingEngine
from matching.engines.rule_based import RuleBasedMatchingEngine
from matching.scoring import ScoredVendor
from tasks.models import Task


class AIRankingEngine(BaseMatchingEngine):
    """
    Future AI re-ranking layer.
    Currently delegates to rule-based scoring and leaves ai_score empty.
    """

    name = 'ai'
    version = '0.1-stub'

    def __init__(self) -> None:
        self._fallback = RuleBasedMatchingEngine()

    def score_candidates(self, *, task: Task) -> list[ScoredVendor]:
        candidates = self._fallback.score_candidates(task=task)
        # Hook: apply Gemini/ML scores to candidate.ai_score and re-sort.
        return candidates
