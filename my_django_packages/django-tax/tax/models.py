from django.db import models
from django.conf import settings

class TaxReturn(models.Model):
    tenant = models.ForeignKey(settings.TENANT_MODEL, on_delete=models.CASCADE)
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, limit_choices_to={'user_type': 'CLIENT'})
    tax_year = models.IntegerField()
    return_type = models.CharField(max_length=50) # e.g. ITR12, ITR14, Provisional
    status = models.CharField(max_length=50, choices=(('NOT_STARTED', 'Not Started'), ('IN_PROGRESS', 'In Progress'), ('REVIEW', 'In Review'), ('FILED', 'Filed')), default='NOT_STARTED')
    due_date = models.DateField()
    filed_date = models.DateField(null=True, blank=True)

class TaxOrganizer(models.Model):
    tax_return = models.OneToOneField(TaxReturn, on_delete=models.CASCADE, related_name='organizer')
    data = models.JSONField(default=dict) # To store interactive questionnaire responses
    is_completed = models.BooleanField(default=False)
