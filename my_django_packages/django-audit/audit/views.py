from rest_framework import viewsets
from .models import Engagement, WorkingPaper
from .serializers import EngagementSerializer, WorkingPaperSerializer

from rest_framework.permissions import IsAuthenticated
from base.permissions import IsOwnerOrStaff, IsStaffUser

class EngagementViewSet(viewsets.ModelViewSet):
    queryset = Engagement.objects.all()
    serializer_class = EngagementSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrStaff]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'user_type', '') == 'STAFF':
            return Engagement.objects.all()
        return Engagement.objects.filter(client=user)

class WorkingPaperViewSet(viewsets.ModelViewSet):
    queryset = WorkingPaper.objects.all()
    serializer_class = WorkingPaperSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrStaff]
    
    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'user_type', '') == 'STAFF':
            return WorkingPaper.objects.all()
        return WorkingPaper.objects.filter(engagement__client=user)
