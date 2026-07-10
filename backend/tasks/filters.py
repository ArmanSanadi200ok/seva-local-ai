import django_filters

from .constants import TaskStatus, UrgencyLevel
from .models import Task


class TaskFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(choices=TaskStatus.choices)
    urgency = django_filters.ChoiceFilter(choices=UrgencyLevel.choices)
    category = django_filters.NumberFilter(field_name='detected_category_id')
    category_slug = django_filters.CharFilter(field_name='detected_category__slug')
    locale = django_filters.CharFilter(lookup_expr='iexact')
    city = django_filters.CharFilter(field_name='location__city', lookup_expr='iexact')

    class Meta:
        model = Task
        fields = ['status', 'urgency', 'category', 'category_slug', 'locale', 'city']
