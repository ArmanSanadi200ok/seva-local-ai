from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

from users.constants import UserRole

from .constants import AvailabilityStatus
from .filters import VendorFilter
from .models import Vendor
from .permissions import CanVerifyVendor, VendorPermission
from .selectors import get_active_categories, get_vendor_queryset_for_user, search_vendors
from .serializers import (
    ServiceCategorySerializer,
    VendorAvailabilitySerializer,
    VendorCreateSerializer,
    VendorDetailSerializer,
    VendorListSerializer,
    VendorUpdateSerializer,
    VendorVerificationSerializer,
)


class ServiceCategoryViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """Read-only service categories for mobile pickers."""

    serializer_class = ServiceCategorySerializer
    permission_classes = [AllowAny]
    queryset = get_active_categories()
    pagination_class = None


class VendorViewSet(viewsets.ModelViewSet):
    """
    Vendor CRUD with filtering, search, and role-based access.

    - Public: list/retrieve verified vendors.
    - Vendor: create one profile, update own.
    - Admin: full access + verification action.
    """

    permission_classes = [VendorPermission]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = VendorFilter
    search_fields = [
        'business_name',
        'owner_name',
        'description',
        'area',
        'subcategory',
        'city',
    ]
    ordering_fields = ['rating', 'created_at', 'business_name']
    ordering = ['-rating', '-created_at']

    def get_queryset(self):
        user = self.request.user
        include_unverified = self.request.query_params.get('mine') == 'true'
        qs = get_vendor_queryset_for_user(user=user, include_unverified=include_unverified)
        search_param = self.request.query_params.get('search')
        if search_param:
            qs = search_vendors(qs, search=search_param)
        return qs

    def get_serializer_class(self):
        if self.action == 'list':
            return VendorListSerializer
        if self.action == 'create':
            return VendorCreateSerializer
        if self.action in ('update', 'partial_update'):
            return VendorUpdateSerializer
        if self.action == 'verify':
            return VendorVerificationSerializer
        if self.action == 'set_availability':
            return VendorAvailabilitySerializer
        return VendorDetailSerializer

    def get_permissions(self):
        if self.action == 'verify':
            return [CanVerifyVendor()]
        if self.action in ('list', 'retrieve'):
            return [AllowAny()]
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        vendor = serializer.save()
        return Response(
            VendorDetailSerializer(vendor, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        vendor = self.get_object()
        return Response(
            VendorDetailSerializer(vendor, context={'request': request}).data,
        )

    @action(detail=False, methods=['get'], url_path='me', permission_classes=[VendorPermission])
    def me(self, request):
        """Current vendor's profile (authenticated vendor only)."""
        if not request.user.is_authenticated or request.user.role != UserRole.VENDOR:
            return Response({'detail': 'Vendor account required.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            vendor = Vendor.objects.select_related('category', 'user').get(user=request.user)
        except Vendor.DoesNotExist:
            return Response({'detail': 'Vendor profile not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = VendorDetailSerializer(vendor, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], url_path='verify')
    def verify(self, request, pk=None):
        """Admin: update verification_status (pending / verified / rejected)."""
        vendor = self.get_object()
        serializer = VendorVerificationSerializer(
            vendor,
            data=request.data,
            partial=True,
            context={'request': request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(VendorDetailSerializer(vendor, context={'request': request}).data)

    @action(detail=True, methods=['patch'], url_path='availability')
    def set_availability(self, request, pk=None):
        """Vendor owner or admin: toggle availability status."""
        vendor = self.get_object()
        if request.user.role != UserRole.ADMIN and vendor.user_id != request.user.id:
            return Response({'detail': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = VendorAvailabilitySerializer(
            vendor,
            data=request.data,
            partial=True,
            context={'request': request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(VendorDetailSerializer(vendor, context={'request': request}).data)

    def destroy(self, request, *args, **kwargs):
        """Soft-delete: deactivate vendor profile instead of hard delete."""
        vendor = self.get_object()
        if request.user.role != UserRole.ADMIN and vendor.user_id != request.user.id:
            return Response({'detail': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)
        vendor.is_active = False
        vendor.availability_status = AvailabilityStatus.OFFLINE
        vendor.save(update_fields=['is_active', 'availability_status', 'updated_at'])
        return Response(status=status.HTTP_204_NO_CONTENT)

class AdminVendorViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.RetrieveModelMixin):
    """Dedicated admin endpoints for vendor moderation."""
    permission_classes = [IsAdminUser]
    serializer_class = VendorDetailSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['verification_status', 'availability_status', 'is_active', 'category']
    search_fields = ['business_name', 'owner_name', 'phone_number', 'city']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return Vendor.objects.select_related('user', 'category').all()

    @action(detail=False, methods=['get'])
    def pending(self, request):
        qs = self.get_queryset().filter(verification_status=VerificationStatus.PENDING)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        vendor = self.get_object()
        vendor.verification_status = VerificationStatus.VERIFIED
        vendor.is_active = True
        vendor.save(update_fields=['verification_status', 'is_active'])
        return Response({'status': 'approved'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        vendor = self.get_object()
        vendor.verification_status = VerificationStatus.REJECTED
        vendor.save(update_fields=['verification_status'])
        return Response({'status': 'rejected'})

    @action(detail=True, methods=['post'])
    def suspend(self, request, pk=None):
        vendor = self.get_object()
        vendor.is_active = False
        vendor.save(update_fields=['is_active'])
        return Response({'status': 'suspended'})

    @action(detail=True, methods=['post'])
    def reactivate(self, request, pk=None):
        vendor = self.get_object()
        vendor.is_active = True
        vendor.save(update_fields=['is_active'])
        return Response({'status': 'reactivated'})

    @action(detail=True, methods=['post'])
    def set_availability(self, request, pk=None):
        vendor = self.get_object()
        status_val = request.data.get('status')
        if status_val in AvailabilityStatus.values:
            vendor.availability_status = status_val
            vendor.save(update_fields=['availability_status'])
            return Response({'status': status_val})
        return Response({'error': 'invalid status'}, status=400)
