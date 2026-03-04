from django.urls import path
from .views import RegisterView, ProfileView, ChangePasswordView, DeleteAccountView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('password/', ChangePasswordView.as_view(), name='password'),
    path('delete/', DeleteAccountView.as_view(), name='delete-account'),
]
