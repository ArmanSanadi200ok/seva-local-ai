from django.urls import path

from .views import PlaceholderView

app_name = 'notifications'

urlpatterns = [
    path('', PlaceholderView.as_view(), name='placeholder'),
]
