from rest_framework import serializers

from ai_engine.constants import SUPPORTED_LOCALES

from .constants import TaskStatus, UrgencyLevel
from .models import Task
from .services import create_task_from_natural_language


class TaskListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source='detected_category.name',
        read_only=True,
        default=None,
    )
    title = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = (
            'id',
            'title',
            'raw_user_input',
            'urgency',
            'location',
            'locale',
            'status',
            'detected_category',
            'category_name',
            'ai_confidence',
            'created_at',
        )
        read_only_fields = fields

    def get_title(self, obj: Task) -> str:
        return obj.structured_output.get('title', '') if obj.structured_output else ''


class TaskDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source='detected_category.name',
        read_only=True,
        default=None,
    )
    category_slug = serializers.CharField(
        source='detected_category.slug',
        read_only=True,
        default=None,
    )

    class Meta:
        model = Task
        fields = (
            'id',
            'customer',
            'raw_user_input',
            'structured_output',
            'detected_category',
            'category_name',
            'category_slug',
            'urgency',
            'location',
            'locale',
            'status',
            'ai_confidence',
            'ai_provider',
            'created_at',
            'updated_at',
        )
        read_only_fields = (
            'id',
            'customer',
            'structured_output',
            'detected_category',
            'category_name',
            'category_slug',
            'ai_confidence',
            'ai_provider',
            'created_at',
            'updated_at',
        )


class TaskCreateSerializer(serializers.Serializer):
    raw_user_input = serializers.CharField(min_length=10, max_length=5000)
    locale = serializers.CharField(max_length=10, required=False, default='en')
    location = serializers.JSONField(required=False)

    def validate_locale(self, value: str) -> str:
        code = value.lower().split('-')[0]
        if code not in SUPPORTED_LOCALES:
            raise serializers.ValidationError(
                f'Unsupported locale. Supported: {", ".join(sorted(SUPPORTED_LOCALES))}'
            )
        return code

    def validate_location(self, value: dict | None) -> dict:
        if value is None:
            return {}
        if not isinstance(value, dict):
            raise serializers.ValidationError('location must be a JSON object.')
        return value

    def create(self, validated_data):
        user = self.context['request'].user
        return create_task_from_natural_language(
            customer=user,
            raw_user_input=validated_data['raw_user_input'],
            locale=validated_data.get('locale', 'en'),
            location=validated_data.get('location', {}),
        )


class TaskStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('status',)

    def validate_status(self, value: str) -> str:
        allowed = {
            TaskStatus.PARSED,
            TaskStatus.PUBLISHED,
            TaskStatus.CANCELLED,
        }
        if value not in allowed:
            raise serializers.ValidationError(
                f'Invalid status transition. Allowed: {", ".join(sorted(allowed))}'
            )
        return value

class AdminTaskSerializer(TaskDetailSerializer):
    match_count = serializers.IntegerField(read_only=True)
    customer_phone = serializers.CharField(source='customer.phone_number', read_only=True)

    class Meta(TaskDetailSerializer.Meta):
        fields = TaskDetailSerializer.Meta.fields + ('match_count', 'customer_phone')
        read_only_fields = TaskDetailSerializer.Meta.read_only_fields + ('match_count', 'customer_phone')
