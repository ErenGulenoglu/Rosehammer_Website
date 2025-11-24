from django.urls import path, include
from .views import (
    UserRegisterView,
    UserMeView,
    LogoutView,
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    VerifyEmailView,
)

urlpatterns = [
    path("signup/", UserRegisterView.as_view(), name="signup"),
    path("verify-email/", VerifyEmailView.as_view()),
    path("token/", CustomTokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", CustomTokenRefreshView.as_view(), name="refresh"),
    path("me/", UserMeView.as_view(), name="user_me"),
    path("logout/", LogoutView.as_view(), name="logout"),
]