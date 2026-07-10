from django.contrib import admin

from .models import ServiceCategory, Vendor


@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = (
        'business_name',
        'owner_name',
        'phone_number',
        'city',
        'area',
        'category',
        'availability_status',
        'verification_status',
        'rating',
        'is_active',
        'created_at',
    )
    list_filter = (
        'verification_status',
        'availability_status',
        'city',
        'category',
        'is_active',
    )
    search_fields = (
        'business_name',
        'owner_name',
        'phone_number',
        'whatsapp_number',
        'area',
        'subcategory',
        'description',
    )
    readonly_fields = ('rating', 'created_at', 'updated_at')
    raw_id_fields = ('user', 'category')
    fieldsets = (
        (
            'Business',
            {
                'fields': (
                    'user',
                    'business_name',
                    'owner_name',
                    'category',
                    'subcategory',
                    'description',
                    'profile_image',
                ),
            },
        ),
        (
            'Contact & location',
            {
                'fields': (
                    'phone_number',
                    'whatsapp_number',
                    'city',
                    'area',
                    'address',
                ),
            },
        ),
        (
            'Status',
            {
                'fields': (
                    'availability_status',
                    'verification_status',
                    'rating',
                    'is_active',
                ),
            },
        ),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
