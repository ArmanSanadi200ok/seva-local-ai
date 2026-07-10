from django.contrib.auth.models import AbstractUser
from django.db import models

from .constants import UserRole
from .managers import UserManager
from .validators import normalize_phone_number


class User(AbstractUser):
    """
    Custom user: phone-based login with role (customer / vendor / admin).
    """

    username = None

    phone_number = models.CharField(
        max_length=15,
        unique=True,
        db_index=True,
        help_text='E.164 format, e.g. +919876543210',
    )
    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.CUSTOMER,
        db_index=True,
    )
    email = models.EmailField(blank=True, default='')

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'
        indexes = [
            models.Index(fields=['role', 'is_active']),
        ]

    def __str__(self) -> str:
        return self.phone_number

    def save(self, *args, **kwargs):
        self.phone_number = normalize_phone_number(self.phone_number)
        if self.role == UserRole.ADMIN:
            self.is_staff = True
        elif not self.is_superuser:
            self.is_staff = False
        super().save(*args, **kwargs)

    @property
    def is_customer(self) -> bool:
        return self.role == UserRole.CUSTOMER

    @property
    def is_vendor(self) -> bool:
        return self.role == UserRole.VENDOR

    @property
    def is_admin_role(self) -> bool:
        return self.role == UserRole.ADMIN
