from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Simple home route to check backend status
def home(request):
    return HttpResponse("Eco Backend is running successfully")

urlpatterns = [
    # Admin route
    path('admin/', admin.site.urls),

    # Home route
    path('', home),

    # App routes
    path('api/users/', include('users.urls')),
    path('api/leaderboard/', include('leaderboard.urls')),
    path('api/marketplace/', include('marketplace.urls')),
    path('api/reports/', include('reports.urls')),

    # JWT Authentication routes
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)