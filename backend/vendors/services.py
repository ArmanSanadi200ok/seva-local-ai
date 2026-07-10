from django.db import IntegrityError

from users.constants import UserRole

from .models import Vendor


class VendorAlreadyExistsError(Exception):
    """Raised when a vendor user already has a profile."""


class VendorServiceError(Exception):
    """Base vendor service error."""


def create_vendor_profile(*, user, **validated_data) -> Vendor:
    if user.role != UserRole.VENDOR:
        raise VendorServiceError('Only users with the vendor role can create a vendor profile.')

    if Vendor.objects.filter(user=user).exists():
        raise VendorAlreadyExistsError('This account already has a vendor profile.')

    try:
        return Vendor.objects.create(user=user, **validated_data)
    except IntegrityError as exc:
        raise VendorServiceError('Could not create vendor profile.') from exc
