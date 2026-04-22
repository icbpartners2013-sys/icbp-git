from rest_framework import viewsets
from .models import Invoice, Payment, Expense
from .serializers import InvoiceSerializer, PaymentSerializer, ExpenseSerializer

from rest_framework.permissions import IsAuthenticated
from base.permissions import IsOwnerOrStaff, IsStaffUser

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrStaff]
    
    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'user_type', '') == 'STAFF':
            return Invoice.objects.all()
        return Invoice.objects.filter(client=user)

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrStaff]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'user_type', '') == 'STAFF':
            return Payment.objects.all()
        return Payment.objects.filter(invoice__client=user)

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated, IsStaffUser] # Expenses only visible to Staff

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'user_type', '') == 'STAFF':
            # Staff can only see their own expenses, unless they are a Manager/Partner. We'll simplify to see their own for now, or all.
            # Simplified: Staff sees all expenses.
            return Expense.objects.all()
        return Expense.objects.none()
