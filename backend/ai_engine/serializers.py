from rest_framework import serializers

from ai_engine.constants import SUPPORTED_LOCALES
from ai_engine.services import get_orchestrator


class ParseIntentSerializer(serializers.Serializer):
    """
    Parse natural language without persisting a task.
    Useful for mobile preview before confirm.
    """

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
        request = self.context['request']
        orchestrator = get_orchestrator()
        parsed = orchestrator.parse_task_intent(
            raw_input=validated_data['raw_user_input'],
            locale=validated_data.get('locale', 'en'),
            location_hint=validated_data.get('location', {}),
            user=request.user if request.user.is_authenticated else None,
        )
        return parsed.to_dict()
