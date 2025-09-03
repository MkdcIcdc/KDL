from rest_framework import serializers
from .models import Patient, Research


class PatientSerializer(serializers.ModelSerializer):
    date_birth = serializers.DateField(format='%d.%m.%Y')

    class Meta:
        model = Patient
        fields = '__all__'


class PatientsListSerializer(serializers.ModelSerializer):
    date_birth = serializers.DateField(format='%d.%m.%Y')

    class Meta:
        model = Patient
        fields = ['id', 's_name', 'name', 'surname', 'date_birth', 'gender', 'p_series', 'p_number']


class ResearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Research
        fields = '__all__'