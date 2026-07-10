from django.db.models import Q, QuerySet

from users.constants import UserRole

from .constants import VerificationStatus
from .models import ServiceCategory, Vendor


def get_public_vendor_queryset() -> QuerySet[Vendor]:
    """Vendors visible to customers on marketplace listings."""
    return (
        Vendor.objects.filter(
            is_active=True,
            verification_status=VerificationStatus.VERIFIED,
        )
        .select_related('category', 'user')
    )


def get_vendor_queryset_for_user(*, user, include_unverified: bool = False) -> QuerySet[Vendor]:
    """Admin sees all; vendors see own; public uses public queryset."""
    if user.is_authenticated and user.role == UserRole.ADMIN:
        return Vendor.objects.select_related('category', 'user')
    if user.is_authenticated and user.role == UserRole.VENDOR:
        return Vendor.objects.filter(user=user).select_related('category', 'user')
    qs = get_public_vendor_queryset()
    if include_unverified and user.is_authenticated:
        return Vendor.objects.filter(
            Q(is_active=True) & (Q(user=user) | Q(verification_status=VerificationStatus.VERIFIED))
        ).select_related('category', 'user')
    return qs


def search_vendors(queryset: QuerySet[Vendor], *, search: str) -> QuerySet[Vendor]:
    if not search:
        return queryset
    term = search.strip()
    return queryset.filter(
        Q(business_name__icontains=term)
        | Q(owner_name__icontains=term)
        | Q(description__icontains=term)
        | Q(area__icontains=term)
        | Q(subcategory__icontains=term)
        | Q(city__icontains=term)
    )


def get_active_categories() -> QuerySet[ServiceCategory]:
    return ServiceCategory.objects.filter(is_active=True)
