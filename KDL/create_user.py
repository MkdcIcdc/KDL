# FOR RUN THIS SHIT
# python manage.py shell
# exec(open('create_user.py').read())

from employer.models import Employer, Department, Role, JT, AD

# Создаем тестового сотрудника
department = Department.objects.create(name="IT Отдел")
role = Role.objects.create(name="Админ")
jt = JT.objects.create(name="Программист")

employer = Employer.objects.create(
    s_name="Бутаков",
    name="Никита",
    surname="Сергеевич",
    dep=department,
    role=role,
    jt=jt
)

# Создаем учетную запись
ad_user = AD.objects.create(emp=employer, login="chesh1re")
ad_user.set_password("T0504365t")
ad_user.save()