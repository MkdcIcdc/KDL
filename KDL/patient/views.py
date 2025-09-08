from rest_framework import viewsets
from rest_framework.response import Response

from .models import Patient, Research
from .serializer import PatientSerializer, ResearchSerializer


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer


class ResearchViewSet(viewsets.ModelViewSet):
    serializer_class = ResearchSerializer

    def get_queryset(self):
        queryset = Research.objects.all()
        patient = self.request.query_params.get('patient')
        if patient:
            queryset = queryset.filter(patient=patient)
        return queryset

