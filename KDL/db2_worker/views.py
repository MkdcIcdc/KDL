from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from datetime import datetime

from .models import Patient
from .serializer import PatientSerializer


class TestPatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

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
            p_birth_str = data.get('date_birth')

            # Преобразуем дату
            p_birth = datetime.strptime(p_birth_str, '%d.%m.%Y').date()
            print(f"Ищу пациента: s_name={p_sname}, name={p_name}, surname={p_surname}, date_birth={p_birth}")
            # Получаем все подходящие записи
            patients = Patient.objects.filter(
                s_name=p_sname,
                name=p_name,
                surname=p_surname,
                date_birth=p_birth
            )

            if not patients.exists():
                return Response({
                    'status': 'error',
                    'message': 'Пациенты не найдены'
                })

            # Сериализуем все найденные объекты
            serializer = PatientSerializer(patients, many=True)

            return Response({
                'status': 'success',
                'patients': serializer.data,
                'message': f'Найдено {patients.count()} пациентов'
            })

        except ValueError:
            return Response({
                'status': 'error',
                'message': 'Некорректный формат даты. Используйте DD.MM.YYYY'
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'Ошибка сервера: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
