from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import FileResponse
from django.conf import settings
import os
from .models import Conclusion
from .serializer import ConclusionSerializer
from lab_data_interpreter import interpreter
from dotenv import load_dotenv
from .conc_docx.main import from_db, create_word_document


load_dotenv(".env")
class ConclusionViewSet(viewsets.ModelViewSet):
    queryset = Conclusion.objects.all()
    serializer_class = ConclusionSerializer

    @action(detail=False, methods=['post'])
    def run_function(self, request):
        param = request.data.get('param')
        interpreter.getState_by_reseach_id_and_save_to_base(
            param_db={
                'host': os.getenv('DB_HOST'),
                'port': os.getenv('DB_PORT'),
                'database': os.getenv('DB_NAME'),
                'user': os.getenv('DB_USER'),
                'password': os.getenv('DB_PASSWORD'),
                'client_encoding': 'utf8',
            },
            research_id=param
        )
        from_db_list = from_db(param)
        file_path = create_word_document(list(from_db_list))

        # Сохраняем путь к файлу в базе
        conclusion.save_file_path(file_path)

        try:
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

    def get_patient_id_from_research(self, research_id):
        """Вспомогательный метод для получения patient_id из research"""
        from patient.models import Research
        try:
            research = Research.objects.get(id=research_id)
            return research.patient.id
        except Research.DoesNotExist:
            return None