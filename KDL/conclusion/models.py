from django.db import models

from KDL.employer.models import Employer
from KDL.patient.models import Patient, Research


class Conclusion(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.SET_NULL, null=True)
    research = models.ForeignKey(Research, on_delete=models.SET_NULL, null=True)
    date_create = models.DateField(auto_now_add=True)
    emp = models.ForeignKey(Employer, on_delete=models.SET_NULL, null=True)
    date_save = models.DateTimeField(auto_now=True)
    inter_result = models.TextField(null=True)
    conc_text = models.TextField(null=True)
    conc_file = models.FilePathField(null=True)

    class Meta:
        db_table = 'Conclusion'