from django.contrib.auth.models import BaseUserManager

from .constants import UserRole


class UserManager(BaseUserManager):
    """Manager for phone-number-based user creation."""

    def create_user(self, phone_number, password=None, **extra_fields):
        if not phone_number:
            raise ValueError('Phone number is required.')

        role = extra_fields.pop('role', UserRole.CUSTOMER)
        extra_fields.setdefault('is_active', True)

        if role == UserRole.ADMIN:
            extra_fields.setdefault('is_staff', True)
        else:
            extra_fields.setdefault('is_staff', False)

        user = self.model(phone_number=phone_number, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields['role'] = UserRole.ADMIN

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(phone_number, password, **extra_fields)
