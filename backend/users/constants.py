from django.db import models


class UserRole(models.TextChoices):
    CUSTOMER = 'customer', 'Customer'
    VENDOR = 'vendor', 'Vendor'
    ADMIN = 'admin', 'Admin'


PUBLIC_REGISTRATION_ROLES = frozenset({UserRole.CUSTOMER, UserRole.VENDOR})
