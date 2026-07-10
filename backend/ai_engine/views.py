from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import ParseIntentSerializer


class ParseIntentView(APIView):
    """
    POST structured intent from raw text (no Task saved).
    Backed by stub rules today; swap provider to Gemini via settings.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ParseIntentSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        structured = serializer.save()
        return Response(
            {
                'structured_output': structured,
                'provider': structured.get('provider', 'stub'),
            },
            status=status.HTTP_200_OK,
        )
