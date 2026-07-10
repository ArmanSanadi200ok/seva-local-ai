from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from matching.models import Match
from tasks.constants import TaskStatus
from tasks.models import Task
from users.constants import UserRole
from users.models import User
from vendors.constants import AvailabilityStatus, VerificationStatus
from vendors.models import ServiceCategory, Vendor


class MatchingAPITestCase(APITestCase):
    def setUp(self):
        self.category = ServiceCategory.objects.create(name='Plumbing', slug='plumbing')
        self.customer = User.objects.create_user(
            '+919444444444',
            'SecurePass123!',
            role=UserRole.CUSTOMER,
        )
        self.vendor_user = User.objects.create_user(
            '+919555555555',
            'SecurePass123!',
            role=UserRole.VENDOR,
        )
        self.vendor = Vendor.objects.create(
            user=self.vendor_user,
            business_name='Quick Plumber',
            owner_name='Suresh',
            phone_number='+919555555555',
            category=self.category,
            subcategory='Pipe repair',
            city='Ichalkaranji',
            area='Station Road',
            address='Shop 1',
            availability_status=AvailabilityStatus.AVAILABLE,
            verification_status=VerificationStatus.VERIFIED,
            rating=4.5,
        )
        self.task = Task.objects.create(
            customer=self.customer,
            raw_user_input='Need plumber for pipe leak at Station Road',
            detected_category=self.category,
            structured_output={
                'title': 'Pipe leak',
                'subcategory': 'Pipe repair',
            },
            location={'city': 'Ichalkaranji', 'area': 'Station Road'},
            status=TaskStatus.PUBLISHED,
        )

    def test_run_matching_and_list_matches(self):
        self.client.force_authenticate(self.customer)
        run_url = reverse('matching:run-matching', kwargs={'task_id': self.task.id})
        response = self.client.post(run_url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertGreaterEqual(len(response.data['matches']), 1)

        matches_url = reverse('matching:task-matches', kwargs={'task_id': self.task.id})
        response = self.client.get(matches_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(response.data['count'], 1)
        self.assertEqual(Match.objects.filter(task=self.task).count(), response.data['count'])

    def test_vendor_recommendations(self):
        self.client.force_authenticate(self.customer)
        self.client.post(reverse('matching:run-matching', kwargs={'task_id': self.task.id}))
        response = self.client.get(
            reverse('matching:vendor-recommendations'),
            {'task_id': self.task.id},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['recommendations']), 1)
