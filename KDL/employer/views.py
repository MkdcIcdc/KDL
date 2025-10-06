from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Employer, AD
from .serializer import EmployerSerializer, ADSerializer


class EmployerViewSet(viewsets.ModelViewSet):
    queryset = Employer.objects.all()
    serializer_class = EmployerSerializer

class ADViewSet(viewsets.ModelViewSet):
    queryset = AD.objects.all()
    serializer_class = ADSerializer

    @action(detail=False, methods=['post'])
    def login(self, request):
        try:
            data = request.data
            login = data.get('login')
            password = data.get('password')

            if not login or not password:
                return Response({
                    'status': 'error',
                    'message': 'Логин и пароль обязательны'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Ищем пользователя по логину
            ad_user = AD.objects.filter(login=login).first()

            if ad_user and ad_user.check_password(password):
                # Получаем данные сотрудника
                employer = ad_user.emp
                return Response({
                    'status': 'success',
                    'employer_id': employer.id,
                    'ad_id': ad_user.id,
                    'user_info': {
                        's_name': employer.s_name,
                        'name': employer.name,
                        'surname': employer.surname,
                        'department': employer.dep.name if employer.dep else None,
                        'role': employer.role.name if employer.role else None
                    },
                    'message': 'Успешная авторизация'
                })
            else:
                return Response({
                    'status': 'error',
                    'message': 'Неверный логин или пароль'
                }, status=status.HTTP_401_UNAUTHORIZED)

        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'Ошибка сервера: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def register(self, request):
        try:
            data = request.data
            login = data.get('login')
            password = data.get('password')
            employer_id = data.get('employer_id')

            if not login or not password or not employer_id:
                return Response({
                    'status': 'error',
                    'message': 'Все поля обязательны'
                }, status=status.HTTP_400_BAD_REQUEST)

            employer = Employer.objects.filter(id=employer_id).first()
            if not employer:
                return Response({
                    'status': 'error',
                    'message': 'Сотрудник не найден'
                }, status=status.HTTP_404_NOT_FOUND)

            # Создаем запись AD с хэшированным паролем
            ad_user = AD(emp=employer, login=login)
            ad_user.set_password(password)
            ad_user.save()

            return Response({
                'status': 'success',
                'message': 'Пользователь создан'
            })

        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'Ошибка создания: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)