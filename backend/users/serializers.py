from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .constants import PUBLIC_REGISTRATION_ROLES, UserRole
from .models import User
from .services import (
    InvalidRegistrationRoleError,
    PhoneAlreadyRegisteredError,
    register_user,
)
from .validators import normalize_phone_number


class UserSerializer(serializers.ModelSerializer):
    """Read / update authenticated user profile."""
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id',
            'phone_number',
            'role',
            'email',
            'first_name',
            'last_name',
            'full_name',
            'is_active',
            'is_superuser',
            'is_staff',
            'date_joined',
        )
        read_only_fields = (
            'id',
            'phone_number',
            'role',
            'is_active',
            'is_superuser',
            'is_staff',
            'date_joined',
            'full_name',
        )

    def get_full_name(self, obj) -> str:
        first = (obj.first_name or '').strip()
        last = (obj.last_name or '').strip()
        return f"{first} {last}".strip()


class RegisterSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=15)
    password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)
    password_confirm = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)
    role = serializers.ChoiceField(
        choices=[
            (UserRole.CUSTOMER, UserRole.CUSTOMER.label),
            (UserRole.VENDOR, UserRole.VENDOR.label),
        ],
    )
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)

    def validate_phone_number(self, value: str) -> str:
        return normalize_phone_number(value)

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError(
                {'password_confirm': 'Passwords do not match.'}
            )
        validate_password(attrs['password'])
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        phone_number = validated_data.pop('phone_number')
        role = validated_data.pop('role')

        try:
            return register_user(
                phone_number=phone_number,
                password=password,
                role=role,
                **validated_data,
            )
        except PhoneAlreadyRegisteredError as exc:
            raise serializers.ValidationError(
                {'phone_number': str(exc)}
            ) from exc
        except InvalidRegistrationRoleError as exc:
            raise serializers.ValidationError({'role': str(exc)}) from exc


class PhoneTokenObtainPairSerializer(TokenObtainPairSerializer):
    """JWT login using phone_number + password."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Parent already exposes USERNAME_FIELD (`phone_number`); drop legacy username only.
        self.fields.pop('username', None)

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['phone_number'] = user.phone_number
        return token

    def validate(self, attrs):
        phone_number = normalize_phone_number(attrs.get('phone_number', ''))
        password = attrs.get('password')

        user = authenticate(
            request=self.context.get('request'),
            phone_number=phone_number,
            password=password,
        )

        if user is None:
            raise serializers.ValidationError(
                'Invalid phone number or password.',
                code='authorization',
            )
        if not user.is_active:
            raise serializers.ValidationError(
                'User account is disabled.',
                code='authorization',
            )

        refresh = self.get_token(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data,
        }
