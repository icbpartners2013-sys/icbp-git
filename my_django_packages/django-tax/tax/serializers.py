from rest_framework import serializers
from .models import TaxReturn, TaxOrganizer

class TaxReturnSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxReturn
        fields = '__all__'

class TaxOrganizerSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxOrganizer
        fields = '__all__'
