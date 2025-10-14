from rest_framework import serializers
from .models import SearchPatient


class SearchPatientSerializer(serializers.ModelSerializer):
    date_birth = serializers.DateField(format='%d.%m.%Y')
    full_passport_data = serializers.SerializerMethodField()

    class Meta:
        model = SearchPatient
        fields = ['id', 's_name', 'name', 'surname', 'date_birth', 'full_passport_data', 'medstat_id']

    def get_full_passport_data(self, obj):
        return f'{obj.p_series} {obj.p_number}'