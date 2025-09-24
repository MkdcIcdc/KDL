import psycopg2
from django.conf import settings

def get_db_connection():
    db_settings = settings.DATABASES['default']
    try:
        return psycopg2.connect(
            host=db_settings['HOST'],
            port=db_settings['PORT'],
            database=db_settings['NAME'],
            user=db_settings['USER'],
            password=db_settings['PASSWORD']
        )
    except Exception as e:
        print(e)


get_db_connection()
