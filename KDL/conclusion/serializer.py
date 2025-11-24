from rest_framework import serializers
from .models import Conclusion


class ConclusionSerializer(serializers.ModelSerializer):
    date_create = serializers.DateTimeField(format='%d.%m.%Y', read_only=True)
    # date_save = serializers.DateField(format='%d.%m.%Y', read_only=True)

    class Meta:
        model = Conclusion
        fields = ['id',
                  'patient_id',
                  'emp_id',
                  'date_create',
                  'date_save',
                  'inter_results',
                  'conc_text',
                  'raw_data',
                  'conc_file',
                  'research_id'
                  ]
