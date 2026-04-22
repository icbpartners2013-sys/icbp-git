from rest_framework import viewsets
from .models import TaxReturn, TaxOrganizer
from .serializers import TaxReturnSerializer, TaxOrganizerSerializer

class TaxReturnViewSet(viewsets.ModelViewSet):
    queryset = TaxReturn.objects.all()
    serializer_class = TaxReturnSerializer

class TaxOrganizerViewSet(viewsets.ModelViewSet):
    queryset = TaxOrganizer.objects.all()
    serializer_class = TaxOrganizerSerializer
