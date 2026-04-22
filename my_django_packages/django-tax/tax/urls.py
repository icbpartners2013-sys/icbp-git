from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaxReturnViewSet, TaxOrganizerViewSet

router = DefaultRouter()
router.register(r'tax_returns', TaxReturnViewSet)
router.register(r'tax_organizers', TaxOrganizerViewSet)

app_name = 'tax'

urlpatterns = [
    path('api/', include(router.urls)),
]
