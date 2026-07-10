from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from users.constants import UserRole
from users.models import User
from vendors.constants import VerificationStatus
from vendors.models import ServiceCategory, Vendor


class VendorAPITestCase(APITestCase):
    def setUp(self):
        self.category = ServiceCategory.objects.create(name='Plumbing', slug='plumbing')
        self.vendor_user = User.objects.create_user(
            '+919111111111',
            'SecurePass123!',
            role=UserRole.VENDOR,
        )
        self.customer = User.objects.create_user(
            '+919222222222',
            'SecurePass123!',
            role=UserRole.CUSTOMER,
        )

    def test_vendor_create_list_search(self):
        self.client.force_authenticate(self.vendor_user)
        response = self.client.post(
            reverse('vendors:vendor-list'),
            {
                'business_name': 'Seva Plumbing',
                'owner_name': 'Raj Patil',
                'phone_number': '9111111111',
                'whatsapp_number': '9111111111',
                'category': self.category.id,
                'subcategory': 'Pipe repair',
                'city': 'Ichalkaranji',
                'area': 'Station Road',
                'address': 'Shop 12, Main Market',
                'description': '24x7 plumbing services',
                'availability_status': 'available',
            },
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        vendor = Vendor.objects.get(user=self.vendor_user)
        vendor.verification_status = VerificationStatus.VERIFIED
        vendor.save()

        self.client.force_authenticate(self.customer)
        response = self.client.get(
            reverse('vendors:vendor-list'),
            {'city': 'Ichalkaranji', 'search': 'Plumbing'},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(response.data['count'], 1)
