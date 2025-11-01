class DatabaseRouter:
    """
    Роутер для управления использованием разных БД
    """

    SOURCE_DB_MODELS = {
        'searchpatient',
        'history',
        'researches',
        'resultresearch',
        'sex'
    }

    def db_for_read(self, model, **hints):
        """
        Модели медстата идут из source_db
        """
        if model._meta.model_name.lower() in self.SOURCE_DB_MODELS:
            return 'source_db'
        return 'default'

    def db_for_write(self, model, **hints):
        """
        Запись для моделей медстата запрещена (только чтение)
        """
        if model._meta.model_name.lower() in self.SOURCE_DB_MODELS:
            return 'source_db'  # или вернуть None для запрета записи
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
        if app_label == 'db2_reader' and model_name.lower() in self.SOURCE_DB_MODELS:
            return db == 'source_db'
        return db == 'default'