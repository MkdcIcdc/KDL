from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

import os
import pyodbc
from pathlib import Path
from dotenv import load_dotenv
from .models import SearchPatient
from patient.models import Patient, Research
from .serializer import SearchPatientSerializer, AddPatientSerializer, PatientResearchSerializer

BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / '.env'
load_dotenv(env_path)

# Проверка загрузки переменных (для отладки)
print(f"DB2_HOST: {os.getenv('DB2_HOST')}")
print(f"DB2_DATABASE: {os.getenv('DB2_DATABASE')}")

class TestPatientViewSet(viewsets.ModelViewSet):
    queryset = SearchPatient.objects.all()
    serializer_class = SearchPatientSerializer

    @action(detail=False, methods=['post'])
    def get_patient(self, request):
        """
        API Endpoint для получения пациента из медстата
        :param request: запрос от frontend
        :return: возвращаются все найденные пациенты согласно serializer
        """
        try:
            data = request.data
            p_sname = data.get('s_name')
            p_name = data.get('name')
            p_surname = data.get('surname')
            p_birth = data.get('date_birth')


            connection_string = (
                f"DRIVER={{{os.getenv('DB2_DRIVER', 'IBM DB2 ODBC DRIVER')}}};"
                f"DATABASE={os.getenv('DB2_DATABASE')};"
                f"HOSTNAME={os.getenv('DB2_HOST')};"
                f"PORT={os.getenv('DB2_PORT', '50000')};"
                f"PROTOCOL={os.getenv('DB2_PROTOCOL', 'TCPIP')};"
                f"UID={os.getenv('DB2_UID')};"
                f"PWD={os.getenv('DB2_PWD')};"
            )

            conn = pyodbc.connect(connection_string)
            cursor = conn.cursor()

            query = """
            SELECT 
                PATIENTNUMBER, LASTNAME, FIRSTNAME, MIDDLENAME, BDAY, 
                DOCSERIA, DOCNUMBER, SNILSNUMBER, DOCUMENTNUMBER
            FROM PATIENTS
            WHERE LASTNAME = ? and FIRSTNAME = ? and MIDDLENAME = ? and BDAY = ?
            """

            cursor.execute(query, p_sname, p_name, p_surname, p_birth)
            patients = cursor.fetchall()

            columns = [column[0] for column in cursor.description]
            patients_list = []

            for row in patients:
                patient_dict = {}
                for i, col in enumerate(columns):
                    # Обработка даты, если это datetime объект
                    value = row[i]
                    if hasattr(value, 'isoformat'):
                        value = value.isoformat()
                    patient_dict[col] = value
                patients_list.append(patient_dict)

            if not patients:
                return Response({
                    'status': 'error',
                    'message': 'Пациенты не найдены'
                })

            cursor.close()
            conn.close()

            return Response({
                'status': 'success',
                'message': f'Найдено {len(patients_list)} пациентов',
                'patients': patients_list
            })




            # Сериализуем все найденные объекты
            # serializer = SearchPatientSerializer(patients, many=True)
            #
            # return Response({
            #     'status': 'success',
            #     'patients': serializer.data,
            #     'message': f'Найдено {patients.count()} пациентов'
            # })

        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'Ошибка сервера: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def add_patient(self, request):
        try:
            data = request.data
            p_num = data.get('PATIENTNUMBER')
            patient = SearchPatient.objects.filter(PATIENTNUMBER=p_num).first()

            # Используем оптимизированный сериализатор
            research_serializer = PatientResearchSerializer(patient)
            researches_data = research_serializer.data.get('researches', [])

            p_serializer = AddPatientSerializer(patient)
            saved_patient = self.save_patient(p_serializer.data, researches_data)

            return Response({
                'status': 'success',
                'patient_id': saved_patient,
                'patient': p_serializer.data,
                'researches': researches_data,
                'message': 'Пациент и его анализы найдены и добавлены в БД'
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'Ошибка сервера: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def save_patient(self, s_patient, s_researches):
        patient, created = Patient.objects.update_or_create(
            medstat_id=s_patient.get('PATIENTNUMBER'),
            defaults={
                's_name': s_patient.get('LASTNAME'),
                'name': s_patient.get('FIRSTNAME'),
                'surname': s_patient.get('MIDDLENAME'),
                'gender': s_patient.get('sex'),
                'date_birth': s_patient.get('BDAY'),
                'p_series': s_patient.get('DOCSERIA'),
                'p_number': s_patient.get('DOCNUMBER'),
                'snils': s_patient.get('SNILSNUMBER'),
                'med_polis': s_patient.get('DOCUMENTNUMBER'),
                'medstat_id': s_patient.get('PATIENTNUMBER'),
            }
        )
        new_p_id = patient.id
        for research in s_researches:
            try:
                research_date = research.get('ACTUALDATETIME')
                if research_date and len(research_date) >= 10:
                    date_str = research_date[:10]  # берем только дату
                    research_date = date_str
                else:
                    research_date = None
            except:
                research_date = None

            patient_obj = Patient.objects.get(id=new_p_id)
            Research.objects.create(
                patient=patient_obj,
                date=research_date,
                research_name=research.get('RESEARCH_CATEGORY'),
                data=research.get('RESULTFORMZAKL')
            )
        return patient.id



