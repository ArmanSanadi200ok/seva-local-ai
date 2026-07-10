from django.test import SimpleTestCase

from ai_engine.parsers.response_parser import parse_gemini_task_response


class ResponseParserTestCase(SimpleTestCase):
    def test_parses_valid_gemini_payload(self):
        payload = {
            'title': 'Pipe leak repair',
            'description': 'Kitchen pipe is leaking',
            'category_slug': 'plumbing',
            'subcategory': 'Pipe repair',
            'urgency': 'high',
            'location': {'city': 'Ichalkaranji', 'area': 'Station Road', 'address': ''},
            'confidence': 0.91,
            'keywords': ['pipe', 'leak'],
        }
        result = parse_gemini_task_response(
            payload=payload,
            raw_input='Kitchen pipe is leaking',
            locale='en',
            location_hint={},
            category_slugs={'plumbing'},
            raw_response_meta={'engine': 'gemini'},
        )
        self.assertEqual(result.category_slug, 'plumbing')
        self.assertEqual(result.urgency, 'high')
        self.assertEqual(result.confidence, 0.91)
        self.assertEqual(result.provider, 'gemini')
