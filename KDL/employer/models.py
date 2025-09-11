from django.db import models

class BaseModel(models.Model):
    name = models.CharField(max_length=256, unique=True)

    class Meta:
        abstract = True

    def __str__(self):
        return self.name

class Department(BaseModel):
    class Meta:
        db_table = 'department'


class JT(BaseModel):
    class Meta:
        db_table = 'jt'


class Role(BaseModel):
    class Meta:
        db_table = 'role'


class Employer(models.Model):
    s_name = models.CharField(max_length=50, null=True)
    name = models.CharField(max_length=50, null=True)
    surname = models.CharField(max_length=50, null=True)
    dep = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)
    jt = models.ForeignKey(JT, on_delete=models.SET_NULL, null=True)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True)

    class Meta:
        db_table = 'employer'


class AD(models.Model):
    emp = models.ForeignKey(Employer, on_delete=models.SET_NULL, null=True)
    login = models.CharField(max_length=50, null=True)
    pwd = models.CharField(max_length=50, null=True)

    class Meta:
        db_table = 'ad'
