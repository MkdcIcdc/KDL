from django.db import models

from employer.models import Employer
from patient.models import Patient, Research
import os
from django.conf import settings


class Conclusion(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.SET_NULL, null=True)
    research = models.ForeignKey(Research, on_delete=models.SET_NULL, null=True)
    date_create = models.DateField(auto_now_add=True)
    emp = models.ForeignKey(Employer, on_delete=models.SET_NULL, null=True)
    date_save = models.DateTimeField(auto_now=True)
    inter_results = models.TextField(null=True)
    raw_data = models.TextField(null=True)
    conc_text = models.TextField(null=True)
    conc_file = models.TextField(null=True)

    class Meta:
        db_table = 'conclusion'

    def save_file_path(self, file_path):
        """Сохраняет относительный путь к файлу"""
        # Получаем относительный путь от BASE_DIR
        relative_path = os.path.relpath(file_path, settings.BASE_DIR)
        self.conc_file = relative_path
        self.save()

    def get_file_url(self):
        """Возвращает URL для скачивания файла"""
        if self.conc_file:
            return f'/api/conclusion/{self.id}/download/'
        return None

    def get_absolute_file_path(self):
        """Возвращает абсолютный путь к файлу"""
        if self.conc_file:
            return os.path.join(settings.BASE_DIR, self.conc_file)
        return None