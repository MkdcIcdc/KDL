from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Conclusion
from .serializer import ConclusionSerializer
from lab_data_interpreter import interpreter
from dotenv import load_dotenv
import os

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
        try:
            result = f'Good! Param {param}'
            return Response({
                'status': 'success',
                'result': result
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)