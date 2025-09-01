from django.db import models

class Patient(models.Model):
    s_name = models.CharField(max_length=50, null=True)
    name = models.CharField(max_length=50, null=True)
    surname = models.CharField(max_length=50, null=True)
    date_birth = models.DateField(null=True)
    p_series = models.CharField(max_length=50, null=True)
    p_number = models.CharField(max_length=50, null=True)
    snils = models.CharField(max_length=50, null=True)
    med_polis = models.CharField(max_length=50, null=True)
    medstat_id = models.CharField(max_length=50, null=True)

    class Meta:
        db_table = 'Patient'


class Research(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, null=True)
    date = models.DateField(null=True)
    research_name = models.CharField(max_length=50, null=True)
    data = models.TextField(null=True)

    class Meta:
        db_table = 'Research'




