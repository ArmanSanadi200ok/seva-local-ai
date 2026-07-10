from django.contrib import admin

from .models import Match, MatchRun


class MatchInline(admin.TabularInline):
    model = Match
    extra = 0
    readonly_fields = ('rank', 'total_score', 'score_breakdown', 'ai_score', 'vendor', 'created_at')
    can_delete = False


@admin.register(MatchRun)
class MatchRunAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'task',
        'engine',
        'engine_version',
        'status',
        'candidate_count',
        'created_at',
    )
    list_filter = ('engine', 'status', 'created_at')
    search_fields = ('task__id', 'error_message')
    readonly_fields = ('metadata', 'error_message', 'created_at')
    inlines = [MatchInline]


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'task',
        'vendor',
        'rank',
        'total_score',
        'ai_score',
        'is_recommended',
        'match_run',
        'created_at',
    )
    list_filter = ('is_recommended', 'match_run__engine')
    search_fields = ('task__id', 'vendor__business_name')
    readonly_fields = ('score_breakdown', 'created_at')
    raw_id_fields = ('task', 'vendor', 'match_run')
