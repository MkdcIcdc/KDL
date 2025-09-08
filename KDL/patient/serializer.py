from rest_framework import serializers
from .models import Patient, Research
from string_splitter import splitter


class PatientSerializer(serializers.ModelSerializer):
    date_birth = serializers.DateField(format='%d.%m.%Y')

    class Meta:
        model = Patient
        fields = '__all__'


class ResearchSerializer(serializers.ModelSerializer):
    date = serializers.DateField(format='%d.%m.%Y')
    data = splitter(Research.data)

    class Meta:
        model = Research
        fields = '__all__'
