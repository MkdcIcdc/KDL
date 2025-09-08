from collections import defaultdict
from rest_framework import serializers
from .models import Patient, Research


class PatientSerializer(serializers.ModelSerializer):
    date_birth = serializers.DateField(format='%d.%m.%Y')

    class Meta:
        model = Patient
        fields = '__all__'


class ResearchSerializer(serializers.ModelSerializer):
    date = serializers.DateField(format='%d.%m.%Y')

    class Meta:
        model = Research
        fields = '__all__'


class GroupedResearchSerializer(serializers.Serializer):
    def to_representation(self, instances):
        """
        Преобразует данные в формат: { date: { research_name: [data1, data2, ...] } }
        Возвращает только поле data из каждой записи
        """
        grouped_data = defaultdict(lambda: defaultdict(list))

        for instance in instances:
            date_str = str(instance.date) if instance.date else 'unknown_date'
            research_name = instance.research_name or 'unknown'

            # Добавляем только данные data
            grouped_data[date_str][research_name].append(instance.data)

        # Преобразуем defaultdict в обычный dict для сериализации
        return dict(grouped_data)