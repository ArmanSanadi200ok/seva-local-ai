from django.contrib import admin

from .models import AIRequestLog


@admin.register(AIRequestLog)
class AIRequestLogAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'pipeline',
        'provider',
        'status',
        'locale',
        'user',
        'service_task',
        'latency_ms',
        'created_at',
    )
    list_filter = ('pipeline', 'provider', 'status', 'locale')
    search_fields = ('raw_input', 'error_message')
    readonly_fields = (
        'structured_output',
        'latency_ms',
        'tokens_used',
        'created_at',
    )
    raw_id_fields = ('user', 'service_task')
