from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    ordering = ('phone_number',)
    list_display = ('phone_number', 'role', 'email', 'is_active', 'is_staff', 'date_joined')
    list_filter = ('role', 'is_active', 'is_staff')
    search_fields = ('phone_number', 'email', 'first_name', 'last_name')

    fieldsets = (
        (None, {'fields': ('phone_number', 'password')}),
        ('Profile', {'fields': ('first_name', 'last_name', 'email', 'role')}),
        (
            'Permissions',
            {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')},
        ),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': (
                    'phone_number',
                    'password1',
                    'password2',
                    'role',
                    'email',
                    'first_name',
                    'last_name',
                ),
            },
        ),
    )

    readonly_fields = ('date_joined', 'last_login')
