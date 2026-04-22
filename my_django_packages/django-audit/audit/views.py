from rest_framework import viewsets
from .models import Engagement, WorkingPaper
from .serializers import EngagementSerializer, WorkingPaperSerializer

class EngagementViewSet(viewsets.ModelViewSet):
    queryset = Engagement.objects.all()
    serializer_class = EngagementSerializer

class WorkingPaperViewSet(viewsets.ModelViewSet):
    queryset = WorkingPaper.objects.all()
    serializer_class = WorkingPaperSerializer
