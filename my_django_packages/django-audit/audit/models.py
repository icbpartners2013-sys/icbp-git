from django.db import models
from django.conf import settings

class Engagement(models.Model):
    tenant = models.ForeignKey(settings.TENANT_MODEL, on_delete=models.CASCADE)
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, limit_choices_to={'user_type': 'CLIENT'})
    manager = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='managed_engagements', limit_choices_to={'user_type': 'STAFF'})
    name = models.CharField(max_length=255)
    financial_year_end = models.DateField()
    status = models.CharField(max_length=50, choices=(('PLANNING', 'Planning'), ('FIELDWORK', 'Fieldwork'), ('REVIEW', 'Review'), ('COMPLETED', 'Completed')), default='PLANNING')
    
class WorkingPaper(models.Model):
    engagement = models.ForeignKey(Engagement, on_delete=models.CASCADE, related_name='working_papers')
    prepared_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='prepared_papers')
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='reviewed_papers')
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='audit/working_papers/')
    status = models.CharField(max_length=50, choices=(('DRAFT', 'Draft'), ('READY_FOR_REVIEW', 'Ready for Review'), ('REVIEWED', 'Reviewed'), ('SIGNED_OFF', 'Signed Off')), default='DRAFT')
