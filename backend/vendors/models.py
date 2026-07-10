from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from users.validators import normalize_phone_number

from .constants import AvailabilityStatus, VerificationStatus


class ServiceCategory(models.Model):
    """Top-level service taxonomy (plumbing, electrical, etc.)."""

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'service categories'
        ordering = ['name']

    def __str__(self) -> str:
        return self.name


class Vendor(models.Model):
    """
    Vendor business profile linked to a vendor-role user account.
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='vendor_profile',
    )
    business_name = models.CharField(max_length=200)
    owner_name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=15, db_index=True)
    whatsapp_number = models.CharField(max_length=15, blank=True, default='')
    category = models.ForeignKey(
        ServiceCategory,
        on_delete=models.PROTECT,
        related_name='vendors',
    )
    subcategory = models.CharField(max_length=100, blank=True, default='')
    city = models.CharField(max_length=100, db_index=True, default='Ichalkaranji')
    area = models.CharField(max_length=120, db_index=True, help_text='Locality / area')
    address = models.TextField()
    description = models.TextField(blank=True, default='')
    availability_status = models.CharField(
        max_length=20,
        choices=AvailabilityStatus.choices,
        default=AvailabilityStatus.OFFLINE,
        db_index=True,
    )
    verification_status = models.CharField(
        max_length=20,
        choices=VerificationStatus.choices,
        default=VerificationStatus.PENDING,
        db_index=True,
    )
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
    )
    profile_image = models.URLField(
        max_length=500,
        blank=True,
        default='',
        help_text='Placeholder URL until media upload is integrated.',
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['city', 'area']),
            models.Index(fields=['category', 'verification_status']),
            models.Index(fields=['availability_status', 'rating']),
        ]

    def __str__(self) -> str:
        return self.business_name

    def save(self, *args, **kwargs):
        self.phone_number = normalize_phone_number(self.phone_number)
        if self.whatsapp_number:
            self.whatsapp_number = normalize_phone_number(self.whatsapp_number)
        super().save(*args, **kwargs)
