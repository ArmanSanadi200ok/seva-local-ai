from django.contrib import admin

from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'customer',
        'status',
        'urgency',
        'detected_category',
        'locale',
        'ai_confidence',
        'ai_provider',
        'created_at',
    )
    list_filter = ('status', 'urgency', 'locale', 'detected_category', 'ai_provider')
    search_fields = ('raw_user_input', 'customer__phone_number')
    readonly_fields = (
        'structured_output',
        'ai_confidence',
        'ai_provider',
        'created_at',
        'updated_at',
    )
    raw_id_fields = ('customer', 'detected_category')
    fieldsets = (
        (
            'Request',
            {
                'fields': (
                    'customer',
                    'raw_user_input',
                    'locale',
                    'location',
                ),
            },
        ),
        (
            'AI output',
            {
                'fields': (
                    'structured_output',
                    'detected_category',
                    'urgency',
                    'ai_confidence',
                    'ai_provider',
                ),
            },
        ),
        ('Workflow', {'fields': ('status',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
