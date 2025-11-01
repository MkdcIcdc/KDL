from rest_framework import serializers
from .models import SearchPatient, History, Researches, ResultResearch


class SearchPatientSerializer(serializers.ModelSerializer):
    BDAY = serializers.DateField(format='%d.%m.%Y')
    full_passport_data = serializers.SerializerMethodField()

    class Meta:
        model = SearchPatient
        fields = ['PATIENTNUMBER', 'LASTNAME', 'FIRSTNAME', 'MIDDLENAME', 'BDAY', 'full_passport_data']

    def get_full_passport_data(self, obj):
        clean_seria = str(obj.DOCSERIA).replace(' ', '') if obj.DOCSERIA else ''
        return f'{clean_seria} {obj.DOCNUMBER}'


class AddPatientSerializer(serializers.ModelSerializer):
    DOCSERIA = serializers.CharField()
    sex = serializers.SerializerMethodField()
    def to_representation(self, instance):
        """Переопределяем вывод данных - убираем пробелы из DOCSERIA"""
        data = super().to_representation(instance)
        if 'DOCSERIA' in data and data['DOCSERIA']:
            data['DOCSERIA'] = data['DOCSERIA'].replace(' ', '')
        return data

    def get_sex(self, obj):
        """Получаем название пола из таблицы SEX"""
        try:
            sex_obj = Sex.objects.filter(KEY=obj.SEX).first()
            if sex_obj:
                return sex_obj.NM_SEX
        except Exception:
            pass
        sex_mapping = {
            '1': 'Мужской',
            '2': 'Женский',
            '3': 'Неизвестно',
            'M': 'Мужской',
            'F': 'Женский',
        }
        return sex_mapping.get(str(obj.SEX), f'Неизвестно ({obj.SEX})')

    class Meta:
        model = SearchPatient
        fields = ['LASTNAME',
                  'FIRSTNAME',
                  'MIDDLENAME',
                  'sex',
                  'BDAY',
                  'DOCSERIA',
                  'DOCNUMBER',
                  'SNILSNUMBER',
                  'DOCUMENTNUMBER',
                  'PATIENTNUMBER']


class HistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = History
        fields = '__all__'


class ResearchesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Researches
        fields = '__all__'


class PatientResearchSerializer(serializers.ModelSerializer):
    researches = serializers.SerializerMethodField()

    class Meta:
        model = SearchPatient
        fields = ['PATIENTNUMBER', 'researches']

    def get_researches(self, obj):
        # Получаем связанные данные через JOIN
        histories = History.objects.filter(PATIENTNUMBER=obj.PATIENTNUMBER)
        researches_data = []

        for history in histories:
            researches = Researches.objects.filter(KEY_HISTORY=history.KEY)
            for research in researches:
                results = ResultResearch.objects.filter(
                    KEY_RESEARCH=research.KEY,
                    KEY_RESEARCH_TYPE__startswith='Roslab'
                )
                for result in results:
                    researches_data.append({
                        'ACTUALDATETIME': research.ACTUALDATETIME,
                        'RESEARCH_CATEGORY': research.RESEARCH_CATEGORY,
                        'RESULTFORMZAKL': result.RESULTFORMZAKL
                    })

        return researches_data


class ResultResearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResultResearch
        fields = '__all__'