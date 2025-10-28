from rest_framework import serializers
from .models import SearchPatient


class SearchPatientSerializer(serializers.ModelSerializer):
    BDAY = serializers.DateField(format='%d.%m.%Y')
    full_passport_data = serializers.SerializerMethodField()

    class Meta:
        model = SearchPatient
        fields = ['PATIENTNUMBER', 'LASTNAME', 'FIRSTNAME', 'MIDDLENAME', 'BDAY', 'full_passport_data']

    def get_full_passport_data(self, obj):
        return f'{obj.DOCSERIA} {obj.DOCNUMBER}'