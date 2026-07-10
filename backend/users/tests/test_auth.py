from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from users.models import User


class AuthAPITestCase(APITestCase):
    def test_register_login_and_profile(self):
        register_url = reverse('auth:register')
        response = self.client.post(
            register_url,
            {
                'phone_number': '9123456789',
                'password': 'SecurePass123!',
                'password_confirm': 'SecurePass123!',
                'role': 'customer',
            },
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(phone_number='+919123456789').exists())

        login_url = reverse('auth:login')
        response = self.client.post(
            login_url,
            {'phone_number': '9123456789', 'password': 'SecurePass123!'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.data["access"]}')
        me_url = reverse('users:me')
        response = self.client.get(me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['role'], 'customer')

    def test_admin_role_not_registerable(self):
        response = self.client.post(
            reverse('auth:register'),
            {
                'phone_number': '9988776655',
                'password': 'SecurePass123!',
                'password_confirm': 'SecurePass123!',
                'role': 'admin',
            },
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
