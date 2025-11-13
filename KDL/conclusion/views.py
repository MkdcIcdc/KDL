from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import FileResponse
from django.conf import settings
from .models import Conclusion
import os
from .serializer import ConclusionSerializer
from lab_data_interpreter import interpreter
from .conc_docx.main import from_db, create_word_document


class ConclusionViewSet(viewsets.ModelViewSet):
    queryset = Conclusion.objects.all()
    serializer_class = ConclusionSerializer

    @action(detail=False, methods=['post'])
    def run_function(self, request):
        param = request.data.get('param')

        try:
            # Получаем patient_id из исследования
            patient_id = self.get_patient_id_from_research(param)
            if not patient_id:
                return Response({
                    'status': 'error',
                    'message': 'Исследование не найдено'
                }, status=status.HTTP_404_NOT_FOUND)


            db_settings = settings.DATABASES['default']
            result_id = interpreter.getStates_by_reseachs_in_day_and_save_to_base(
                param_db={
                    'host': db_settings['HOST'],
                    'port': db_settings['PORT'],
                    'database': db_settings['NAME'],
                    'user': db_settings['USER'],
                    'password': db_settings['PASSWORD'],
                    'client_encoding': 'utf8',
                },
                research_id=param,
            )[1]

            print(f'Result id: {result_id}')
            conclusion = Conclusion.objects.get(id=result_id)
            from_db_list = from_db(result_id)
            file_path = create_word_document(list(from_db_list))

            # Сохраняем путь к файлу в базе
            conclusion.save_file_path(file_path)

            result = {
                'message': f'Заключение создано! Research ID: {param}',
                'download_url': conclusion.get_file_url(),
                'conclusion_id': conclusion.id
            }
            return Response({
                'status': 'success',
                'result': result
            }, status=status.HTTP_200_OK)

        except Exception as e:
             return Response({
                 'status': 'error',
                 'message': str(e)
             }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Эндпоинт для скачивания файла"""
        try:
            conclusion = self.get_object()
            file_path = conclusion.get_absolute_file_path()

            if not file_path or not os.path.exists(file_path):
                return Response({
                    'status': 'error',
                    'message': 'Файл не найден'
                }, status=status.HTTP_404_NOT_FOUND)

            filename = os.path.basename(file_path)
            response = FileResponse(open(file_path, 'rb'))
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            return response

        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def get_patient_id_from_research(self, research_id):
        """Вспомогательный метод для получения patient_id из research"""
        from patient.models import Research
        try:
            research = Research.objects.get(id=research_id)
            return research.patient.id
        except Research.DoesNotExist:
            return None

    @action(detail=False, methods=['get'])
    def check_conclusion(self, request):
        """Проверяет наличие заключения по research_id"""
        research_id = request.query_params.get('research_id')
        if not research_id:
            return Response({
                'status': 'error',
                'message': 'Не указан research_id'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Ищем существующее заключение
            conclusion = Conclusion.objects.filter(
                research_id=research_id,
                conc_file__isnull=False
            ).order_by('-date_create').first()

            if conclusion and conclusion.conc_file:
                # Проверяем, что файл действительно существует
                file_exists = os.path.exists(conclusion.get_absolute_file_path())

                if file_exists:
                    return Response({
                        'status': 'success',
                        'exists': True,
                        'conclusion_id': conclusion.id,
                        'download_url': conclusion.get_file_url(),
                        'message': 'Заключение уже существует'
                    })
                else:
                    # Файл не существует, удаляем запись
                    conclusion.conc_file = None
                    conclusion.save()

            return Response({
                'status': 'success',
                'exists': False,
                'message': 'Заключение не найдено'
            })

        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)