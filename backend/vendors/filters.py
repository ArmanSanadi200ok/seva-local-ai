import django_filters

from .constants import AvailabilityStatus, VerificationStatus
from .models import Vendor


class VendorFilter(django_filters.FilterSet):
    city = django_filters.CharFilter(lookup_expr='iexact')
    area = django_filters.CharFilter(lookup_expr='icontains')
    category = django_filters.NumberFilter(field_name='category_id')
    category_slug = django_filters.CharFilter(field_name='category__slug')
    subcategory = django_filters.CharFilter(lookup_expr='icontains')
    availability_status = django_filters.ChoiceFilter(choices=AvailabilityStatus.choices)
    verification_status = django_filters.ChoiceFilter(choices=VerificationStatus.choices)
    min_rating = django_filters.NumberFilter(field_name='rating', lookup_expr='gte')
    max_rating = django_filters.NumberFilter(field_name='rating', lookup_expr='lte')

    class Meta:
        model = Vendor
        fields = [
            'city',
            'area',
            'category',
            'category_slug',
            'subcategory',
            'availability_status',
            'verification_status',
        ]
