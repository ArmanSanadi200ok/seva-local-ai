from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import IntegrityError

from .constants import PUBLIC_REGISTRATION_ROLES, UserRole
from .models import User
from .validators import normalize_phone_number


class PhoneAlreadyRegisteredError(Exception):
    """Raised when registering a duplicate phone number."""


class InvalidRegistrationRoleError(Exception):
    """Raised when a disallowed role is requested at registration."""


def register_user(*, phone_number: str, password: str, role: str, **extra_fields) -> User:
    """
    Create a new user with validated password and normalized phone.
    Admin accounts must be created via createsuperuser, not this API.
    """
    if role not in PUBLIC_REGISTRATION_ROLES:
        raise InvalidRegistrationRoleError(
            f'Role "{role}" cannot be registered via API. Use customer or vendor.'
        )

    normalized_phone = normalize_phone_number(phone_number)
    validate_password(password)

    try:
        return User.objects.create_user(
            normalized_phone,
            password,
            role=role,
            **extra_fields,
        )
    except IntegrityError as exc:
        raise PhoneAlreadyRegisteredError('This phone number is already registered.') from exc
    except ValidationError:
        raise
