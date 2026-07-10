from django.db.models import QuerySet

from users.constants import UserRole

from .models import Task


def get_tasks_for_user(*, user) -> QuerySet[Task]:
    qs = Task.objects.select_related('customer', 'detected_category')
    if user.is_authenticated and user.role == UserRole.ADMIN:
        return qs
    if user.is_authenticated:
        return qs.filter(customer=user)
    return qs.none()
