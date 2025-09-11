from django.db import models

class Glossary(models.Model):
    name = models.CharField(max_length=256, unique=True)

    class Meta:
        abstract = True

    def __str__(self):
        return self.name


class System(Glossary):
    class Meta:
        db_table = 'system'

class Organ(Glossary):
    class Meta:
        db_table = 'organ'

class State(Glossary):
    class Meta:
        db_table = 'state'

class Parameter(Glossary):
    class Meta:
        db_table = 'parameter'

class Gender(Glossary):
    class Meta:
        db_table = 'gender'

class POTC(Glossary):
    class Meta:
        db_table = 'potc'

class TOD(Glossary):
    class Meta:
        db_table = 'tod'

class Deviation(Glossary):
    class Meta:
        db_table = 'deviation'

class Dynamics(Glossary):
    class Meta:
        db_table = 'dynamics'

class Priority(Glossary):
    class Meta:
        db_table = 'priority'

class Weight(models.Model):
    value = models.IntegerField()
    class Meta:
        db_table = 'weight'
    def __str__(self):
        return str(self.value)

class Rec(Glossary):
    class Meta:
        db_table = 'rec'

class DOS(models.Model):
    system = models.ForeignKey(System, on_delete=models.SET_NULL, null=True)
    organ = models.ForeignKey(Organ, on_delete=models.SET_NULL, null=True)
    state = models.ForeignKey(State, on_delete=models.SET_NULL, null=True)
    parameter = models.ForeignKey(Parameter, on_delete=models.SET_NULL, null=True)
    gender = models.ForeignKey(Gender, on_delete=models.SET_NULL, null=True)
    age_min = models.IntegerField(null=True)
    age_max = models.IntegerField(null=True)
    potc = models.ForeignKey(POTC, on_delete=models.SET_NULL, null=True)
    tod = models.ForeignKey(TOD, on_delete=models.SET_NULL, null=True)
    norm_min = models.CharField(max_length=50, null=True)
    norm_max = models.CharField(max_length=50, null=True)
    mod_dev_min = models.CharField(max_length=50, null=True)
    mod_dev_max = models.CharField(max_length=50, null=True)
    exp_dev_min = models.CharField(max_length=50, null=True)
    exp_dev_max = models.CharField(max_length=50, null=True)
    crit_dev_min = models.CharField(max_length=50, null=True)
    crit_dev_max = models.CharField(max_length=50, null=True)
    deviation = models.ForeignKey(Deviation, on_delete=models.SET_NULL, null=True)
    pos_dyn = models.ForeignKey(Dynamics, related_name="positive_dyn", on_delete=models.SET_NULL, null=True)
    neg_dyn = models.ForeignKey(Dynamics, related_name="negative_dyn", on_delete=models.SET_NULL, null=True)
    priority = models.ForeignKey(Priority, on_delete=models.SET_NULL, null=True)
    weight = models.ForeignKey(Weight, on_delete=models.SET_NULL, null=True)
    rec = models.ForeignKey(Rec, on_delete=models.SET_NULL, null=True)

    class Meta:
        db_table = 'dos'