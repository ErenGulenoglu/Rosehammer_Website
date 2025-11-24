from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import User
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from .utils import send_verification_email, generate_registration_token, verify_registration_token
import os
from django.contrib.auth.hashers import make_password

# Create your views here.

class UserRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        data.pop("passwordConfirm")

        # Hash password before storing in token
        password = data.pop("password")
        data["password"] = make_password(password)

        token = generate_registration_token(data)
        send_verification_email(token, data["email"])

        return Response({"detail": "Verification email sent"}, status=200)


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        token = request.GET.get("token")
        data = verify_registration_token(token)

        if not data:
            return Response({"detail": "Invalid or expired token"}, status=400)

        # Prevent race condition / duplicate emails
        if User.objects.filter(email=data["email"]).exists():
            return Response({"detail": "Email already used"}, status=400)

        user = User.objects.create(**data)
        user.is_active = True
        user.save()

        return Response({"detail": "Account verified and created successfully"}, status=201)

class UserMeView(APIView):
    permission_classes = [IsAuthenticated]  # only allow logged-in users

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Modern login view:
    - Access token returned in JSON
    - Refresh token stored in HttpOnly cookie (not in JSON)
    - Works for both localhost (dev) and HTTPS (prod)
    """
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        # print("something")
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user

        if not user.is_active:
            return Response({"detail": "Email not verified"}, status=403)

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)

        # Build response JSON (access only)
        response = Response({
            "access": access,
        }, status=status.HTTP_200_OK)

        if os.environ.get("DEBUG", "True") == "True":
            # Local development
            secure = False
            samesite = "Lax"
        else:
            # Production
            secure = True
            samesite = "None"

        # Set refresh token as HttpOnly cookie
        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,        # Must be True for security (cannot be accessed via JS)
            secure=secure,         # False for localhost HTTP; True for HTTPS in production
            samesite=samesite,       # "Lax" works for dev; "None" + secure=True for cross-site prod
            max_age=7 * 24 * 60 * 60,
            path="/",
        )

        return response

class CustomTokenRefreshView(APIView):
    """
    Reads refresh token from HttpOnly cookie and returns a new access token.
    """
    permission_classes = [AllowAny]
    def post(self, request):
        # print("anything")
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            return Response({"detail": "Refresh token not provided"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(refresh_token)
            access = str(refresh.access_token)
            return Response({"access": access}, status=status.HTTP_200_OK)
        except TokenError:
            return Response({"detail": "Invalid or expired refresh token"}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = [AllowAny] # Safe because we use HttpOnly cookies
    def post(self, request):
        # print("asd")
        response = Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)
        response.delete_cookie("refresh_token")
        return response