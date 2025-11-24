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
        fields = ['KEY', 'PATIENTNUMBER']


class ResearchesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Researches
        fields = ['KEY', 'KEY_HISTORY', 'ACTUALDATETIME', 'RESEARCH_CATEGORY']


class PatientResearchSerializer(serializers.ModelSerializer):
    researches = serializers.SerializerMethodField()

    class Meta:
        model = SearchPatient
        fields = ['PATIENTNUMBER', 'researches']

    def get_researches(self, obj):
        try:
            from django.db import connections

            # Используем соединение с source_db
            with connections['source_db'].cursor() as cursor:
                query = """
                SELECT 
                    r."ACTUALDATETIME", 
                    r."RESEARCH_CATEGORY", 
                    rr2."RESULTFORMZAKL"
                FROM "HISTORY" h
                JOIN "RESEARCHES" r ON h."KEY" = r."KEY_HISTORY"
                JOIN "RESEARCH_RESULTSR2" rr2 ON r."KEY" = rr2."KEY_RESEARCH"
                WHERE h."PATIENTNUMBER" = %s
                AND rr2."RESULTFORMZAKL" IS NOT NULL
                AND rr2."RESULTFORMZAKL" != ''
                AND TRIM(rr2."RESULTFORMZAKL") != ''
                AND rr2."KEY_RESEARCH_TYPE" LIKE 'Roslab%%'
                """

                cursor.execute(query, [obj.PATIENTNUMBER])
                columns = [col[0] for col in cursor.description]
                return [
                    dict(zip(columns, row))
                    for row in cursor.fetchall()
                ]

        except Exception as e:
            print(f"Ошибка при получении исследований: {e}")
            return []


class ResultResearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResultResearch
        fields = ['KEY_RESEARCH', 'RESULTFORMZAKL', 'KEY_RESEARCH_TYPE']