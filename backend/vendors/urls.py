from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AdminVendorViewSet, ServiceCategoryViewSet, VendorViewSet

app_name = 'vendors'

router = DefaultRouter()
router.register('categories', ServiceCategoryViewSet, basename='category')
router.register('admin', AdminVendorViewSet, basename='admin-vendor')
router.register('', VendorViewSet, basename='vendor')

urlpatterns = [
    path('', include(router.urls)),
]
