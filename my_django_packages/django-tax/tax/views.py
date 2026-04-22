from rest_framework import viewsets
from .models import TaxReturn, TaxOrganizer
from .serializers import TaxReturnSerializer, TaxOrganizerSerializer

from rest_framework.permissions import IsAuthenticated
from base.permissions import IsOwnerOrStaff

class TaxReturnViewSet(viewsets.ModelViewSet):
    queryset = TaxReturn.objects.all()
    serializer_class = TaxReturnSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrStaff]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'user_type', '') == 'STAFF':
            return TaxReturn.objects.all()
        return TaxReturn.objects.filter(client=user)

class TaxOrganizerViewSet(viewsets.ModelViewSet):
    queryset = TaxOrganizer.objects.all()
    serializer_class = TaxOrganizerSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrStaff]
    
    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'user_type', '') == 'STAFF':
            return TaxOrganizer.objects.all()
        return TaxOrganizer.objects.filter(tax_return__client=user)
