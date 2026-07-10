"""
Root URL configuration for Ichalkaranji Seva API.
"""

from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.auth_urls')),
    path('api/users/', include('users.profile_urls')),
    path('api/vendors/', include('vendors.urls')),
    path('api/tasks/', include('tasks.urls')),
    path('api/matching/', include('matching.urls')),
    path('api/ai/', include('ai_engine.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/analytics/', include('analytics.urls')),
]
