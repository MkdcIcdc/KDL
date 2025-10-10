from rest_framework import serializers
from .models import Patient


class PatientSerializer(serializers.ModelSerializer):
    date_birth = serializers.DateField(format='%d.%m.%Y')

    class Meta:
        model = Patient
        fields = ['id', 's_name', 'name', 'surname', 'date_birth', 'medstat_id']