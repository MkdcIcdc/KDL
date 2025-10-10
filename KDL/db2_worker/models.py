from django.db import models

class SearchPatient(models.Model):
    # Описать таблицу как она лежит в медстате
    s_name = models.CharField(max_length=50, null=True)
    name = models.CharField(max_length=50, null=True)
    surname = models.CharField(max_length=50, null=True)
    gender = models.CharField(max_length=20, null=True)
    date_birth = models.DateField(null=True)
    p_series = models.CharField(max_length=50, null=True)
    p_number = models.CharField(max_length=50, null=True)
    snils = models.CharField(max_length=50, null=True)
    med_polis = models.CharField(max_length=50, null=True)
    medstat_id = models.CharField(max_length=50, null=True)

    class Meta:
        db_table = 'patient' # название таблицы как в медстате
        managed = False # данный метод не создаёт таблицу в медстате