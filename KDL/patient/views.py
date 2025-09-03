from rest_framework import viewsets

from .models import Patient
from .serializer import PatientSerializer, PatientsListSerializer


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer


class PatientsListViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientsListSerializer