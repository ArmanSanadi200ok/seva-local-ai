from rest_framework import serializers

from users.constants import UserRole
from users.validators import normalize_phone_number

from .constants import AvailabilityStatus, VerificationStatus
from .models import ServiceCategory, Vendor
from .services import VendorAlreadyExistsError, VendorServiceError, create_vendor_profile


class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = ('id', 'name', 'slug', 'is_active')
        read_only_fields = fields


class VendorListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)

    class Meta:
        model = Vendor
        fields = (
            'id',
            'business_name',
            'owner_name',
            'phone_number',
            'whatsapp_number',
            'category',
            'category_name',
            'category_slug',
            'subcategory',
            'city',
            'area',
            'availability_status',
            'verification_status',
            'rating',
            'profile_image',
            'created_at',
        )
        read_only_fields = fields


class VendorDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)

    class Meta:
        model = Vendor
        fields = (
            'id',
            'user',
            'business_name',
            'owner_name',
            'phone_number',
            'whatsapp_number',
            'category',
            'category_name',
            'category_slug',
            'subcategory',
            'city',
            'area',
            'address',
            'description',
            'availability_status',
            'verification_status',
            'rating',
            'profile_image',
            'is_active',
            'created_at',
            'updated_at',
        )
        read_only_fields = (
            'id',
            'user',
            'verification_status',
            'rating',
            'created_at',
            'updated_at',
        )


class VendorCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = (
            'business_name',
            'owner_name',
            'phone_number',
            'whatsapp_number',
            'category',
            'subcategory',
            'city',
            'area',
            'address',
            'description',
            'availability_status',
            'profile_image',
        )

    def validate_phone_number(self, value: str) -> str:
        return normalize_phone_number(value)

    def validate_whatsapp_number(self, value: str) -> str:
        if not value:
            return ''
        return normalize_phone_number(value)

    def validate_category(self, value: ServiceCategory) -> ServiceCategory:
        if not value.is_active:
            raise serializers.ValidationError('Selected category is not active.')
        return value

    def create(self, validated_data):
        user = self.context['request'].user
        try:
            return create_vendor_profile(user=user, **validated_data)
        except VendorAlreadyExistsError as exc:
            raise serializers.ValidationError({'detail': str(exc)}) from exc
        except VendorServiceError as exc:
            raise serializers.ValidationError({'detail': str(exc)}) from exc


class VendorUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = (
            'business_name',
            'owner_name',
            'phone_number',
            'whatsapp_number',
            'category',
            'subcategory',
            'city',
            'area',
            'address',
            'description',
            'availability_status',
            'profile_image',
            'is_active',
        )

    def validate_phone_number(self, value: str) -> str:
        return normalize_phone_number(value)

    def validate_whatsapp_number(self, value: str) -> str:
        if not value:
            return ''
        return normalize_phone_number(value)


class VendorVerificationSerializer(serializers.ModelSerializer):
    """Admin-only verification status update."""

    class Meta:
        model = Vendor
        fields = ('verification_status',)

    def validate_verification_status(self, value: str) -> str:
        if value not in VerificationStatus.values:
            raise serializers.ValidationError('Invalid verification status.')
        return value


class VendorAvailabilitySerializer(serializers.ModelSerializer):
    """Vendor owner quick status toggle for mobile clients."""

    class Meta:
        model = Vendor
        fields = ('availability_status',)

    def validate_availability_status(self, value: str) -> str:
        if value not in AvailabilityStatus.values:
            raise serializers.ValidationError('Invalid availability status.')
        return value
