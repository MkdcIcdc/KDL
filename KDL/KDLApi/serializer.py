from rest_framework import serializers

from .models import (
    System, Organ, State, Parameter, Gender, POTC, TOD,
    Deviation, Dynamics, Priority, Weight, Rec, DOS
)


class BaseGlossarySerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['id', 'name']


class SystemSerializer(BaseGlossarySerializer):
    class Meta(BaseGlossarySerializer.Meta):
        model = System


class OrganSerializer(BaseGlossarySerializer):
    class Meta(BaseGlossarySerializer.Meta):
        model = Organ


class StateSerializer(BaseGlossarySerializer):
    class Meta(BaseGlossarySerializer.Meta):
        model = State


class ParameterSerializer(BaseGlossarySerializer):
    class Meta(BaseGlossarySerializer.Meta):
        model = Parameter


class GenderSerializer(BaseGlossarySerializer):
    class Meta(BaseGlossarySerializer.Meta):
        model = Gender


class POTCSerializer(BaseGlossarySerializer):
    class Meta(BaseGlossarySerializer.Meta):
        model = POTC


class TODSerializer(BaseGlossarySerializer):
    class Meta(BaseGlossarySerializer.Meta):
        model = TOD


class DeviationSerializer(BaseGlossarySerializer):
    class Meta(BaseGlossarySerializer.Meta):
        model = Deviation


class DynamicsSerializer(BaseGlossarySerializer):
    class Meta(BaseGlossarySerializer.Meta):
        model = Dynamics


class PrioritySerializer(BaseGlossarySerializer):
    class Meta(BaseGlossarySerializer.Meta):
        model = Priority


class WeightSerializer(BaseGlossarySerializer):
    class Meta:
        model = Weight
        fields = ['id', 'value']


class RecSerializer(BaseGlossarySerializer):
    class Meta(BaseGlossarySerializer.Meta):
        model = Rec


class DOSReadSerializer(serializers.ModelSerializer):
    system = serializers.CharField(source='system.name', read_only=True)
    organ = serializers.CharField(source='organ.name', read_only=True)
    state = serializers.CharField(source='state.name', read_only=True)
    parameter = serializers.CharField(source='parameter.name', read_only=True)
    gender = serializers.CharField(source='gender.name', read_only=True)
    potc = serializers.CharField(source='potc.name', read_only=True)
    tod = serializers.CharField(source='tod.name', read_only=True)
    deviation = serializers.CharField(source='deviation.name', read_only=True)
    pos_dyn = serializers.CharField(source='pos_dyn.name', read_only=True)
    neg_dyn = serializers.CharField(source='neg_dyn.name', read_only=True)
    priority = serializers.CharField(source='priority.name', read_only=True)
    weight = serializers.CharField(source='weight.value', read_only=True)
    rec = serializers.CharField(source='rec.name', read_only=True)

    class Meta:
        model = DOS
        fields = '__all__'


class DOSWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = DOS
        fields = [
            'id', 'system', 'organ', 'state', 'parameter', 'gender',
            'age_min', 'age_max', 'potc', 'tod', 'norm_min', 'norm_max',
            'mod_dev_min', 'mod_dev_max', 'exp_dev_min', 'exp_dev_max',
            'crit_dev_min', 'crit_dev_max', 'deviation',
            'pos_dyn', 'neg_dyn', 'priority', 'weight', 'rec'
        ]
