from rest_framework.permissions import BasePermission

from users.constants import UserRole


class CanAccessTaskMatching(BasePermission):
    """Customer who owns the task, or platform admin."""

    def has_permission(self, request, view) -> bool:
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj) -> bool:
        task = getattr(obj, 'task', obj)
        if request.user.role == UserRole.ADMIN:
            return True
        return task.customer_id == request.user.id
