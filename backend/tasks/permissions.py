from rest_framework.permissions import BasePermission, SAFE_METHODS

from users.constants import UserRole
from users.permissions import IsAdminRole


class TaskPermission(BasePermission):
    """
    - Customers: create and manage own tasks.
    - Admins: full access.
    """

    def has_permission(self, request, view) -> bool:
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in SAFE_METHODS:
            return request.user.role in {UserRole.CUSTOMER, UserRole.ADMIN}
        if request.method == 'POST':
            return request.user.role in {UserRole.CUSTOMER, UserRole.ADMIN}
        return request.user.role in {UserRole.CUSTOMER, UserRole.ADMIN}

    def has_object_permission(self, request, view, obj) -> bool:
        if request.user.role == UserRole.ADMIN:
            return True
        return obj.customer_id == request.user.id


class CanPublishTask(BasePermission):
    def has_object_permission(self, request, view, obj) -> bool:
        if request.user.role == UserRole.ADMIN:
            return True
        return obj.customer_id == request.user.id
