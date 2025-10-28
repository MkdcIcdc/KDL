class DatabaseRouter:
    """
    Роутер для управления использованием разных БД
    """

    def db_for_read(self, model, **hints):
        """
        Чтение для модели SearchPatient идет из source_db
        Остальные модели используют default
        """
        if model._meta.model_name == 'searchpatient':
            return 'source_db'
        return 'default'

    def db_for_write(self, model, **hints):
        """
        Запись для всех моделей идет в default БД
        SearchPatient только для чтения
        """
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        """
        Разрешаем отношения между объектами из разных БД
        """
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Миграции применяются только к default БД
        """
        return db == 'default'