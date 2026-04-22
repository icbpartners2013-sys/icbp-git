from rest_framework import serializers
from .models import Engagement, WorkingPaper

class EngagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Engagement
        fields = '__all__'

class WorkingPaperSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkingPaper
        fields = '__all__'
