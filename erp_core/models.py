from django.db import models

class Page(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    content = models.JSONField(default=dict)
    
    def __str__(self):
        return self.title
