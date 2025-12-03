# db2_backend/operations.py
from django.db.backends.base.operations import BaseDatabaseOperations


class DatabaseOperations(BaseDatabaseOperations):
    compiler_module = "django.db.models.sql.compiler"

    # Важно: указываем, что мы используем параметризованные запросы
    param_style = 'pyformat'  # Django будет использовать %s

    operators = {
        'exact': '= %s',
        'iexact': 'LIKE UPPER(%s)',
        'contains': 'LIKE %s',
        'icontains': 'LIKE UPPER(%s)',
        'gt': '> %s',
        'gte': '>= %s',
        'lt': '< %s',
        'lte': '<= %s',
        'startswith': 'LIKE %s',
        'endswith': 'LIKE %s',
        'istartswith': 'LIKE UPPER(%s)',
        'iendswith': 'LIKE UPPER(%s)',
        'regex': 'LIKE %s',
        'iregex': 'LIKE UPPER(%s)',
    }

    pattern_esc = r"REPLACE(REPLACE(REPLACE({}, '\', '\\'), '%%', '\%%'), '_', '\_')"
    pattern_ops = {
        'contains': "LIKE '%%' || {} || '%%'",
        'icontains': "LIKE '%%' || UPPER({}) || '%%'",
        'startswith': "LIKE {} || '%%'",
        'istartswith': "LIKE UPPER({}) || '%%'",
        'endswith': "LIKE '%%' || {}",
        'iendswith': "LIKE '%%' || UPPER({})",
    }

    def __init__(self, connection):
        super().__init__(connection)
        self.connection = connection

    def quote_name(self, name):
        return f'"{name}"'

    def limit_offset_sql(self, low_mark, high_mark):
        limit, offset = self._get_limit_offset_params(low_mark, high_mark)
        sql = ''

        if offset:
            sql += f' OFFSET {offset} ROWS'
        if limit is not None:
            if offset:
                sql += f' FETCH NEXT {limit} ROWS ONLY'
            else:
                sql += f' FETCH FIRST {limit} ROWS ONLY'

        return sql

    def last_executed_query(self, cursor, sql, params):
        # Для отладки
        if hasattr(cursor, '_cursor'):
            cursor = cursor._cursor
        return cursor.statement

    def no_limit_value(self):
        return None

    def sql_flush(self, style, tables, *, reset_sequences=False, allow_cascade=False):
        sql = []
        for table in tables:
            sql.append(f'DELETE FROM {self.quote_name(table)}')
        return sql

    def conditional_expression_supported_in_where_clause(self, expression):
        return True

    def combine_expression(self, connector, sub_expressions):
        if connector == '%%':
            connector = '||'  # Для DB2 конкатенация строк
        return ' %s ' % connector.join(sub_expressions)

    def adapt_datefield_value(self, value):
        """Адаптация даты для DB2"""
        if value is None:
            return None
        return value

    def adapt_datetimefield_value(self, value):
        """Адаптация даты-времени для DB2"""
        if value is None:
            return None
        return value

    def adapt_timefield_value(self, value):
        if value is None:
            return None
        return value

    def prepare_sql_script(self, sql):
        return [sql]

    def max_name_length(self):
        return 128

    def bulk_insert_sql(self, fields, placeholder_rows):
        placeholder_rows_sql = (", ".join(row) for row in placeholder_rows)
        values_sql = ", ".join("(%s)" % sql for sql in placeholder_rows_sql)
        return "VALUES " + values_sql