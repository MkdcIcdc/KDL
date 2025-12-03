from django.db.backends.base.introspection import BaseDatabaseIntrospection
from django.db.backends.base.introspection import FieldInfo as BaseFieldInfo
from django.db.backends.base.introspection import TableInfo as BaseTableInfo
from collections import namedtuple
import re


class DatabaseIntrospection(BaseDatabaseIntrospection):
    # Типы данных для маппинга
    data_types_reverse = {
        4: 'IntegerField',  # INTEGER
        5: 'SmallIntegerField',  # SMALLINT
        -5: 'BigIntegerField',  # BIGINT
        8: 'FloatField',  # DOUBLE
        2: 'DecimalField',  # DECIMAL/NUMERIC
        12: 'CharField',  # VARCHAR
        1: 'CharField',  # CHAR
        -1: 'TextField',  # CLOB
        -2: 'BinaryField',  # BLOB
        91: 'DateField',  # DATE
        92: 'TimeField',  # TIME
        93: 'DateTimeField',  # TIMESTAMP
        16: 'BooleanField',  # BOOLEAN
    }

    def get_table_list(self, cursor):
        """Возвращает список таблиц в базе данных"""
        cursor.execute("""
            SELECT TABNAME, TABSCHEMA, TYPE 
            FROM SYSCAT.TABLES 
            WHERE TYPE IN ('T', 'V') 
            AND TABSCHEMA NOT LIKE 'SYS%'
            ORDER BY TABSCHEMA, TABNAME
        """)
        return [
            BaseTableInfo(
                row[0].lower(),
                {'BASE TABLE': 't', 'VIEW': 'v'}.get(row[2], row[2])
            )
            for row in cursor.fetchall()
        ]

    def get_table_description(self, cursor, table_name):
        """Возвращает описание таблицы"""
        schema, table = self.split_table_name(table_name)

        cursor.execute(f"""
            SELECT 
                COLNAME,
                TYPENAME,
                LENGTH,
                SCALE,
                NULLS,
                DEFAULT
            FROM SYSCAT.COLUMNS 
            WHERE TABNAME = '{table.upper()}' 
            AND TABSCHEMA = '{schema.upper()}'
            ORDER BY COLNO
        """)

        # Используем стандартный FieldInfo
        columns = []
        for row in cursor.fetchall():
            columns.append(
                BaseFieldInfo(
                    name=row[0].lower(),
                    type_code=self._get_type_code(row[1]),
                    display_size=None,
                    internal_size=row[2],
                    precision=row[2],
                    scale=row[3],
                    null_ok=row[4] == 'Y',
                    # default не передаем, так как его нет в BaseFieldInfo
                )
            )
        return columns

    def split_table_name(self, table_name):
        """Разделяет имя таблицы на схему и имя"""
        if '.' in table_name:
            schema, table = table_name.split('.')
            return schema.strip('"'), table.strip('"')
        return self.connection.settings_dict.get('SCHEMA', 'CURRENT SCHEMA'), table_name.strip('"')

    def _get_type_code(self, db_type):
        """Конвертирует строковый тип DB2 в числовой код"""
        type_map = {
            'INTEGER': 4,
            'SMALLINT': 5,
            'BIGINT': -5,
            'DOUBLE': 8,
            'DECIMAL': 2,
            'NUMERIC': 2,
            'VARCHAR': 12,
            'CHAR': 1,
            'CLOB': -1,
            'BLOB': -2,
            'DATE': 91,
            'TIME': 92,
            'TIMESTAMP': 93,
            'BOOLEAN': 16,
        }
        # Убираем размерность, если есть (например, VARCHAR(50))
        db_type = re.sub(r'\(.*\)', '', db_type.upper())
        return type_map.get(db_type, 12)

    def get_relations(self, cursor, table_name):
        """Возвращает внешние ключи таблицы"""
        schema, table = self.split_table_name(table_name)

        cursor.execute(f"""
            SELECT 
                FK_COLNAMES,
                PK_COLNAMES,
                PK_TABNAME,
                PK_TABSCHEMA
            FROM SYSCAT.REFERENCES 
            WHERE TABNAME = '{table.upper()}' 
            AND TABSCHEMA = '{schema.upper()}'
        """)

        relations = {}
        for row in cursor.fetchall():
            fk_cols = row[0].split()  # Все колонки FK
            pk_cols = row[1].split()  # Все колонки PK

            # Создаем маппинг для каждой колонки
            for fk_col, pk_col in zip(fk_cols, pk_cols):
                pk_table = f"{row[3].lower()}.{row[2].lower()}"
                relations[fk_col.lower()] = (pk_table, pk_col.lower())

        return relations