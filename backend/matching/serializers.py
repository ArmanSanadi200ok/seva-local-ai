from rest_framework import serializers

from vendors.serializers import VendorListSerializer

from .models import Match, MatchRun


class MatchRunSerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchRun
        fields = (
            'id',
            'task',
            'engine',
            'engine_version',
            'status',
            'candidate_count',
            'metadata',
            'error_message',
            'created_at',
        )
        read_only_fields = fields


class MatchSerializer(serializers.ModelSerializer):
    vendor = VendorListSerializer(read_only=True)

    class Meta:
        model = Match
        fields = (
            'id',
            'match_run',
            'task',
            'vendor',
            'rank',
            'total_score',
            'score_breakdown',
            'ai_score',
            'is_recommended',
            'created_at',
        )
        read_only_fields = fields


class VendorRecommendationSerializer(serializers.ModelSerializer):
    """Mobile-friendly recommendation card with vendor details + score."""

    vendor = VendorListSerializer(read_only=True)

    class Meta:
        model = Match
        fields = (
            'rank',
            'total_score',
            'score_breakdown',
            'ai_score',
            'is_recommended',
            'vendor',
        )
        read_only_fields = fields
