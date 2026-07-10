from unittest.mock import MagicMock, patch

from django.test import TestCase, override_settings

from ai_engine.exceptions import GeminiAPIError
from ai_engine.services.orchestrator import AIOrchestrator
from users.constants import UserRole
from users.models import User


class OrchestratorFallbackTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            '+919666666666',
            'SecurePass123!',
            role=UserRole.CUSTOMER,
        )

    @override_settings(AI_PROVIDER='gemini', GEMINI_API_KEY='test-key', AI_FALLBACK_TO_STUB=True)
    def test_falls_back_to_stub_when_gemini_fails(self):
        mock_gemini = MagicMock()
        mock_gemini.name = 'gemini'
        mock_gemini.parse_task_intent.side_effect = GeminiAPIError('quota exceeded')

        orchestrator = AIOrchestrator(provider=mock_gemini)
        result = orchestrator.parse_task_intent(
            raw_input='Urgent pipe leak in kitchen need plumber today',
            locale='en',
            user=self.user,
        )

        self.assertEqual(result.provider, 'stub')
        self.assertTrue(result.raw_response.get('fallback_used'))
        self.assertEqual(result.raw_response.get('fallback_from'), 'gemini')

    @override_settings(AI_PROVIDER='gemini', GEMINI_API_KEY='test-key')
    @patch('ai_engine.services.gemini_service.GeminiService.parse_task_intent')
    def test_gemini_success_path(self, mock_parse):
        mock_parse.return_value = (
            {
                'title': 'Fan repair',
                'description': 'Need electrician for fan repair',
                'category_slug': 'electrical',
                'subcategory': 'Fan',
                'urgency': 'medium',
                'location': {'city': 'Ichalkaranji', 'area': '', 'address': ''},
                'confidence': 0.88,
                'keywords': ['fan', 'electric'],
            },
            {'engine': 'gemini', 'model': 'gemini-2.0-flash', 'latency_ms': 120, 'tokens_used': 256},
        )

        from vendors.models import ServiceCategory

        ServiceCategory.objects.create(name='Electrical', slug='electrical')

        orchestrator = AIOrchestrator()
        result = orchestrator.parse_task_intent(
            raw_input='Need electrician for fan repair',
            locale='en',
            user=self.user,
        )

        self.assertEqual(result.provider, 'gemini')
        self.assertEqual(result.category_slug, 'electrical')
