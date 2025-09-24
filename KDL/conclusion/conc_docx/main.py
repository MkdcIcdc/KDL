import json
import ast
import os
from .from_db_data_fetch import get_data, get_patient
from docxtpl import DocxTemplate
from django.conf import settings

def from_db(id: int):
    fromdb = get_data(id)
    data_string = fromdb[0]
    if data_string.startswith('"') and data_string.endswith('"'):
        data_string = data_string[1:-1]

    try:
        python_data = ast.literal_eval(data_string)
    except (SyntaxError, ValueError) as e:
        print(f"Ошибка преобразования: {e}")
        python_data = []

    json_string = json.dumps(python_data, ensure_ascii=False, indent=2)
    python_object = json.loads(json_string)
    p_data = patient_from_db(id)
    return python_object, p_data

def patient_from_db(id: int):
    p_data = get_patient(id)
    keys_list = ['fio', 'date_birth', 'gender']
    res_dict = dict(zip(keys_list, p_data))
    return res_dict

def get_last_key_value_pair(d):
    def find_deepest(current_dict):
        for key, value in current_dict.items():
            if isinstance(value, dict) and value:
                return find_deepest(value)
            else:
                return (key, value)

    return find_deepest(d)

def create_word_document(in_list: list):
    func_dict = {}
    func_list = []
    first_item = in_list[0]
    for i in range(len(first_item)):
        last_key, last_value = get_last_key_value_pair(first_item[i])
        last_key = last_key.split(':', 1)
        last_key = last_key[0]

        for sub_item_text in last_value:
            sub_item_parts = sub_item_text.split(':', 1)
            sub_item_parts = sub_item_parts[0]
            func_list.append(sub_item_parts)
            func_dict[last_key] = func_list
        func_list = []

    current_dir = os.path.dirname(os.path.abspath(__file__))

    docx_dir = os.path.join(settings.BASE_DIR, 'docx')
    os.makedirs(docx_dir, exist_ok=True)

    template_path = os.path.join(current_dir, 'template.docx')
    tpl = DocxTemplate(template_path)
    tpl.render({"p_data": in_list[1], "func_dict": func_dict})
    filename = f"{in_list[1]['fio']}_заключение.docx"
    file_path = os.path.join(docx_dir, filename)
    tpl.save(file_path)

    # Возвращаем путь к созданному файлу
    return file_path


