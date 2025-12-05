from datetime import datetime

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import connections
from .models import SearchPatient
from patient.models import Patient, Research
from .serializer import SearchPatientSerializer, AddPatientSerializer, PatientResearchSerializer


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

            if p_birth:
                try:
                    dt = datetime.strptime(p_birth, '%d.%m.%Y')
                    p_birth = dt.strftime('%Y-%m-%d')
                except ValueError:
                    pass

            import sys

            sys.stderr.write(f"DEBUG: Фамилия: {p_sname}\n")
            sys.stderr.write(f"DEBUG: Имя: {p_name}\n")
            sys.stderr.write(f"DEBUG: Отчество: {p_surname}\n")
            sys.stderr.write(f"DEBUG: Дата рождения: {p_birth}\n")
            sys.stderr.flush()

            patients = SearchPatient.objects.filter(
                LASTNAME=p_sname,
                FIRSTNAME=p_name,
                MIDDLENAME=p_surname,
                BDAY=p_birth
            )

            if not patients.exists():
                return Response({
                    'status': 'error',
                    'message': 'Пациенты не найдены'
                })

            # Сериализуем все найденные объекты
            serializer = SearchPatientSerializer(patients, many=True)

            return Response({
                'status': 'success',
                'patients': serializer.data,
                'message': f'Найдено {patients.count()} пациентов'
            })

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
            # Извлекаем только дату через split
            research_date_str = str(research.get('ACTUALDATETIME'))
            research_date = None

            if research_date_str:
                # Разделяем строку по символу T и берем первую часть
                parts = research_date_str.split('T')
                if len(parts) > 0:
                    research_date = parts[0][:10]
                    print(research_date)

            patient_obj = Patient.objects.get(id=new_p_id)
            Research.objects.create(
                patient=patient_obj,
                date=research_date,
                research_name=research.get('RESEARCH_CATEGORY'),
                data=research.get('RESULTFORMZAKL')
            )
        return patient.id


    @action(detail=False, methods=['post'])
    def update_patient_researches(self, request):
        """
        Просто вызывает add_patient с тем же PATIENTNUMBER
        Так как add_patient уже реализует логику update_or_create
        """
        try:
            data = request.data
            p_num = data.get('PATIENTNUMBER')

            if not p_num:
                return Response({
                    'status': 'error',
                    'message': 'Не указан PATIENTNUMBER пациента'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Просто вызываем существующий endpoint add_patient
            # Он сам реализует update_or_create логику
            return self.add_patient(request)

        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'Ошибка сервера: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
