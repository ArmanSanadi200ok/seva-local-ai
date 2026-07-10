from django.urls import path

from .views import PlaceholderView

app_name = 'analytics'

urlpatterns = [
    path('', PlaceholderView.as_view(), name='placeholder'),
]
