from rest_framework import viewsets
from .models import (
    System, Organ, State, Parameter, Gender, POTC, TOD,
    Deviation, Dynamics, Priority, Weight, Consectary, Rec, DOS
)
from .serializer import (
    SystemSerializer, OrganSerializer, StateSerializer, ParameterSerializer,
    GenderSerializer, POTCSerializer, TODSerializer, DeviationSerializer,
    DynamicsSerializer, PrioritySerializer, WeightSerializer, ConsectarySerializer,
    RecSerializer, DOSReadSerializer, DOSWriteSerializer
)

# 🔹 Базовый ViewSet для глоссариев
class GlossaryViewSet(viewsets.ModelViewSet):
    """Общий CRUD для справочников"""
    # queryset и serializer_class будут задаваться в наследниках


# 🔹 Конкретные ViewSet-ы для каждого глоссария
class SystemViewSet(GlossaryViewSet):
    queryset = System.objects.all().order_by('id')
    serializer_class = SystemSerializer

class OrganViewSet(GlossaryViewSet):
    queryset = Organ.objects.all().order_by('id')
    serializer_class = OrganSerializer

class StateViewSet(GlossaryViewSet):
    queryset = State.objects.all().order_by('id')
    serializer_class = StateSerializer

class ParameterViewSet(GlossaryViewSet):
    queryset = Parameter.objects.all().order_by('id')
    serializer_class = ParameterSerializer

class GenderViewSet(GlossaryViewSet):
    queryset = Gender.objects.all().order_by('id')
    serializer_class = GenderSerializer

class POTCViewSet(GlossaryViewSet):
    queryset = POTC.objects.all().order_by('id')
    serializer_class = POTCSerializer

class TODViewSet(GlossaryViewSet):
    queryset = TOD.objects.all().order_by('id')
    serializer_class = TODSerializer

class DeviationViewSet(GlossaryViewSet):
    queryset = Deviation.objects.all().order_by('id')
    serializer_class = DeviationSerializer

class DynamicsViewSet(GlossaryViewSet):
    queryset = Dynamics.objects.all().order_by('id')
    serializer_class = DynamicsSerializer

class PriorityViewSet(GlossaryViewSet):
    queryset = Priority.objects.all().order_by('id')
    serializer_class = PrioritySerializer

class WeightViewSet(GlossaryViewSet):
    queryset = Weight.objects.all().order_by('id')
    serializer_class = WeightSerializer

class ConsectaryViewSet(GlossaryViewSet):
    queryset = Consectary.objects.all().order_by('id')
    serializer_class = ConsectarySerializer

class RecViewSet(GlossaryViewSet):
    queryset = Rec.objects.all().order_by('id')
    serializer_class = RecSerializer


# 🔹 ViewSet для DOS с разными сериализаторами для чтения/записи
class DOSViewSet(viewsets.ModelViewSet):
    queryset = DOS.objects.all().order_by('id')

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return DOSReadSerializer
        return DOSWriteSerializer

    def perform_create(self, serializer):
        print("Validated data:", serializer.validated_data)
        instance = serializer.save()
        print("Saved pos_dyn:", instance.pos_dyn)
        print("Saved neg_dyn:", instance.neg_dyn)
