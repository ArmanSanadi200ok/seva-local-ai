from rest_framework.permissions import BasePermission

from .constants import UserRole


class HasRole(BasePermission):
    """Allow access only if the user's role is in ``allowed_roles``."""

    allowed_roles: frozenset[str] = frozenset()

    def has_permission(self, request, view) -> bool:
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return user.role in self.allowed_roles


class IsCustomer(HasRole):
    allowed_roles = frozenset({UserRole.CUSTOMER})


class IsVendor(HasRole):
    allowed_roles = frozenset({UserRole.VENDOR})


class IsAdminRole(HasRole):
    allowed_roles = frozenset({UserRole.ADMIN})
