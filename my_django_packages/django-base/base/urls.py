from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TenantViewSet, UserViewSet, ServiceViewSet

router = DefaultRouter()
router.register(r'tenants', TenantViewSet)
router.register(r'users', UserViewSet)
router.register(r'services', ServiceViewSet)

app_name = 'base'

urlpatterns = [
    path('api/', include(router.urls)),
]
