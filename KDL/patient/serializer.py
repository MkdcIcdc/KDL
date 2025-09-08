from rest_framework import serializers
from .models import Patient, Research
from .string_splitter import splitter

class PatientSerializer(serializers.ModelSerializer):
    date_birth = serializers.DateField(format='%d.%m.%Y')

    class Meta:
        model = Patient
        fields = '__all__'

class ResearchSerializer(serializers.ModelSerializer):
    date = serializers.DateField(format='%d.%m.%Y')
    data_parsed = serializers.SerializerMethodField()  # Добавляем вычисляемое поле

    class Meta:
        model = Research
        fields = ['patient', 'date', 'research_name', 'data_parsed']

    def get_data_parsed(self, obj):
        """Метод для парсинга данных"""
        return splitter(obj.data) if obj.data else {}