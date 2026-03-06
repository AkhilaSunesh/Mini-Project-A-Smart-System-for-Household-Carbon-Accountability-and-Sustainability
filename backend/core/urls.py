from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import FrontendAppView

urlpatterns = [
    # Admin route
    path('admin/', admin.site.urls),

    # App routes (API)
    path('api/users/', include('users.urls')),
    path('api/leaderboard/', include('leaderboard.urls')),
    path('api/marketplace/', include('marketplace.urls')),
    path('api/reports/', include('reports.urls')),

    # JWT Authentication routes
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Frontend route (React)
    path('', FrontendAppView.as_view(), name='home'),
    re_path(r'^.*$', FrontendAppView.as_view()),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
