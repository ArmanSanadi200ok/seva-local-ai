from django.urls import path

from .views import ParseIntentView

app_name = 'ai_engine'

urlpatterns = [
    path('parse/', ParseIntentView.as_view(), name='parse'),
]
