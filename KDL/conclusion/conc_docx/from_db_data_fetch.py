from .db_conn import get_db_connection

def get_data(id: int):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        query_string = 'SELECT inter_results FROM conclusion WHERE research_id = %s'
        cursor.execute(query_string, (id,))
        data = cursor.fetchone()
        return data
    finally:
        conn.close()

def get_patient(id: int):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        query_string = ("select (patient.s_name || ' ' || patient.name || ' ' || patient.surname) AS FIO, "
                        "TO_CHAR(patient.date_birth, 'DD.MM.YYYY') AS date_birth, "
                        "patient.gender "
                        "from conclusion "
                        "join patient on conclusion.patient_id = patient.id "
                        "where conclusion.research_id = %s")
        cursor.execute(query_string, (id,))
        data = cursor.fetchone()
        return data
    finally:
        conn.close()
