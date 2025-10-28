from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import SearchPatient
from .serializer import SearchPatientSerializer


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

            # Преобразуем дату
            print(f"Ищу пациента: s_name={p_sname}, name={p_name}, surname={p_surname}, date_birth={p_birth}")
            # Получаем все подходящие записи
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
