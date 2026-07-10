from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from users.constants import UserRole
from users.models import User
from vendors.models import ServiceCategory
from tasks.constants import TaskStatus
from tasks.models import Task


class TaskAPITestCase(APITestCase):
    def setUp(self):
        ServiceCategory.objects.create(name='Plumbing', slug='plumbing')
        self.customer = User.objects.create_user(
            '+919333333333',
            'SecurePass123!',
            role=UserRole.CUSTOMER,
        )

    def test_create_task_runs_stub_parser(self):
        self.client.force_authenticate(self.customer)
        response = self.client.post(
            reverse('tasks:task-list'),
            {
                'raw_user_input': 'Urgent pipe leak in kitchen need plumber today',
                'locale': 'en',
                'location': {'city': 'Ichalkaranji', 'area': 'Station Road'},
            },
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], TaskStatus.PARSED)
        self.assertIn('structured_output', response.data)
        task = Task.objects.get(pk=response.data['id'])
        self.assertEqual(task.detected_category.slug, 'plumbing')

    def test_parse_intent_without_save(self):
        self.client.force_authenticate(self.customer)
        response = self.client.post(
            reverse('ai_engine:parse'),
            {'raw_user_input': 'Need electrician for fan repair', 'locale': 'en'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('structured_output', response.data)
        self.assertEqual(Task.objects.count(), 0)
