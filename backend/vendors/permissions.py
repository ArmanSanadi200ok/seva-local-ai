from rest_framework.permissions import BasePermission, SAFE_METHODS

from users.constants import UserRole
from users.permissions import IsAdminRole


class IsVendorOwnerOrAdmin(BasePermission):
    """Object-level: vendor profile owner or platform admin."""

    def has_object_permission(self, request, view, obj) -> bool:
        if request.user.role == UserRole.ADMIN:
            return True
        return getattr(obj, 'user_id', None) == request.user.id


class VendorPermission(BasePermission):
    """
    - Public read for active vendor listings.
    - Create: authenticated vendor without an existing profile.
    - Write: owner or admin.
  """

    def has_permission(self, request, view) -> bool:
        if request.method in SAFE_METHODS:
            return True
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method == 'POST':
            return request.user.role == UserRole.VENDOR
        return request.user.role in {UserRole.VENDOR, UserRole.ADMIN}

    def has_object_permission(self, request, view, obj) -> bool:
        if request.method in SAFE_METHODS:
            return True
        if request.user.role == UserRole.ADMIN:
            return True
        return obj.user_id == request.user.id


class CanVerifyVendor(IsAdminRole):
    """Admin-only verification status updates."""

    pass
