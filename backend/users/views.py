from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializers import (
    PhoneTokenObtainPairSerializer,
    RegisterSerializer,
    UserSerializer,
)


class RegisterView(generics.CreateAPIView):
    """Register a new customer or vendor account."""

    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                'message': 'Registration successful.',
                'user': UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(TokenObtainPairView):
    """Obtain JWT access + refresh tokens using phone_number and password."""

    serializer_class = PhoneTokenObtainPairSerializer
    permission_classes = [AllowAny]


class RefreshTokenView(TokenRefreshView):
    """Refresh an access token."""

    permission_classes = [AllowAny]


class MeView(generics.RetrieveUpdateAPIView):
    """Authenticated user profile."""

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class LogoutView(APIView):
    """
  Client-side logout helper.
  With JWT stateless auth, discard tokens on the client.
  Optional server-side blacklist can be added later.
  """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response(
            {'message': 'Logged out. Discard access and refresh tokens on the client.'},
            status=status.HTTP_200_OK,
        )
