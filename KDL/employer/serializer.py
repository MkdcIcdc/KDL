from rest_framework import serializers
from .models import Employer, AD


class EmployerSerializer(serializers.ModelSerializer):
    dep_name = serializers.CharField(source='dep.name', read_only=True)
    role_name = serializers.CharField(source='role.name', read_only=True)
    jt_name = serializers.CharField(source='jt.name', read_only=True)

    class Meta:
        model = Employer
        fields = '__all__'


class ADSerializer(serializers.ModelSerializer):
    employer_info = serializers.SerializerMethodField()

    class Meta:
        model = AD
        fields = ['id', 'login', 'emp', 'employer_info']
        extra_kwargs = {
            'pwd': {'write_only': True}  # Пароль не отображается при сериализации
        }

    def get_employer_info(self, obj):
        if obj.emp:
            return {
                's_name': obj.emp.s_name,
                'name': obj.emp.name,
                'surname': obj.emp.surname,
                'department': obj.emp.dep.name if obj.emp.dep else None
            }
        return None

    def create(self, validated_data):
        password = validated_data.pop('pwd', None)
        instance = super().create(validated_data)
        if password:
            instance.set_password(password)
            instance.save()
        return instance