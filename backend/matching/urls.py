from django.urls import path

from .views import RunMatchingView, TaskMatchListView, VendorRecommendationsView

app_name = 'matching'

urlpatterns = [
    path(
        'tasks/<int:task_id>/matches/',
        TaskMatchListView.as_view(),
        name='task-matches',
    ),
    path(
        'tasks/<int:task_id>/run/',
        RunMatchingView.as_view(),
        name='run-matching',
    ),
    path(
        'recommendations/',
        VendorRecommendationsView.as_view(),
        name='vendor-recommendations',
    ),
]
