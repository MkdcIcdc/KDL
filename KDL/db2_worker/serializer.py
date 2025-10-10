from rest_framework import serializers
from .models import SearchPatient


class SearchPatientSerializer(serializers.ModelSerializer):
    date_birth = serializers.DateField(format='%d.%m.%Y')

    class Meta:
        model = SearchPatient
        fields = ['id', 's_name', 'name', 'surname', 'date_birth', 'medstat_id']