from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Conclusion
from .serializer import ConclusionSerializer


class ConclusionViewSet(viewsets.ModelViewSet):
    queryset = Conclusion.objects.all()
    serializer_class = ConclusionSerializer

    @action(detail=False, methods=['post'])
    def run_function(self, request):
        param = request.data.get('param')
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