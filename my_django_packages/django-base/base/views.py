from rest_framework import viewsets
from .models import Tenant, User, Service
from .serializers import TenantSerializer, UserSerializer, ServiceSerializer

from rest_framework.permissions import IsAuthenticated
from .permissions import IsStaffUser, IsStaffOrClientReadOnly, IsOwnerOrStaff

class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [IsStaffOrClientReadOnly]

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrStaff]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'user_type', '') == 'STAFF':
            return User.objects.all()
        return User.objects.filter(id=user.id)

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsStaffOrClientReadOnly]
