from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class Tenant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('STAFF', 'Staff'),
        ('CLIENT', 'Client'),
    )
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, null=True, blank=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='CLIENT')
    
    # Staff Hierarchy
    STAFF_ROLE_CHOICES = (
        ('PARTNER', 'Partner / Managing Director'),
        ('SENIOR_MANAGER', 'Senior Manager'),
        ('MANAGER', 'Manager'),
        ('SENIOR_ASSOCIATE', 'Senior Associate'),
        ('ASSOCIATE', 'Associate / Staff Accountant'),
        ('INTERN', 'Intern'),
    )
    staff_role = models.CharField(max_length=20, choices=STAFF_ROLE_CHOICES, null=True, blank=True)
    staff_title = models.CharField(max_length=100, null=True, blank=True) # e.g. Audit Senior, Tax Associate
    
    # Client Type
    CLIENT_TYPE_CHOICES = (
        ('PERSONAL', 'Personal'),
        ('BUSINESS', 'Business'),
    )
    client_type = models.CharField(max_length=20, choices=CLIENT_TYPE_CHOICES, null=True, blank=True)
    client_subtype = models.CharField(max_length=100, null=True, blank=True) # e.g. HNWIs, Startup, Sole Proprietor

    def __str__(self):
        return f"{self.username} - {self.get_user_type_display()}"

class Service(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100) # Personal, Business, CIPC
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class ClientService(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'user_type': 'CLIENT'})
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, default='Active')

class TimeEntry(models.Model):
    staff = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'user_type': 'STAFF'})
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='billed_time', null=True, blank=True)
    hours = models.DecimalField(max_digits=5, decimal_places=2)
    billable = models.BooleanField(default=True)
    date = models.DateField()
    description = models.TextField()

class Document(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_docs')
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='client_docs', null=True, blank=True)
    file = models.FileField(upload_to='documents/')
    name = models.CharField(max_length=255)
    requires_signature = models.BooleanField(default=False)
    is_signed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
