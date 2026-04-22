from django.db import models
from django.conf import settings

class Invoice(models.Model):
    tenant = models.ForeignKey(settings.TENANT_MODEL, on_delete=models.CASCADE)
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, limit_choices_to={'user_type': 'CLIENT'}, related_name='invoices')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=(('UNPAID', 'Unpaid'), ('PAID', 'Paid'), ('OVERDUE', 'Overdue'), ('WRITTEN_OFF', 'Written Off')), default='UNPAID')
    created_at = models.DateTimeField(auto_now_add=True)

class Payment(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    method = models.CharField(max_length=50) # e.g. Credit Card, ACH

class Expense(models.Model):
    tenant = models.ForeignKey(settings.TENANT_MODEL, on_delete=models.CASCADE)
    staff = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, limit_choices_to={'user_type': 'STAFF'})
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    date_incurred = models.DateField()
    is_reimbursable = models.BooleanField(default=True)
    status = models.CharField(max_length=20, choices=(('PENDING', 'Pending'), ('APPROVED', 'Approved'), ('REJECTED', 'Rejected')), default='PENDING')
