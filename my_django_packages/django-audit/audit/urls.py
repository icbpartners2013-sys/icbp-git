from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EngagementViewSet, WorkingPaperViewSet

router = DefaultRouter()
router.register(r'engagements', EngagementViewSet)
router.register(r'working_papers', WorkingPaperViewSet)

app_name = 'audit'

urlpatterns = [
    path('api/', include(router.urls)),
]
