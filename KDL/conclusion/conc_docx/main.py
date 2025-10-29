import json
import ast
import os
from .from_db_data_fetch import get_data, get_patient
from docxtpl import DocxTemplate
from django.conf import settings

def from_db(id: int):
    fromdb = get_data(id)
    data_string = fromdb[0]

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
        if not isinstance(current_dict, dict) or not current_dict:
            return None, current_dict

        for key, value in current_dict.items():
            if isinstance(value, dict) and value:
                deeper_key, deeper_value = find_deepest(value)
                if deeper_key is not None:
                    return deeper_key, deeper_value
            return key, value
        return None, None

    return find_deepest(d)

def create_word_document(in_list: list):
    func_dict = {}

    data_dict = in_list[0]
    p_data = in_list[1]

    # Получаем заключение и рекомендации
    recap = data_dict.get('recap', '')  # Заключение
    recomend = data_dict.get('recomend', '')  # Рекомендации

    # Если рекомендации в формате строки-списка, преобразуем в настоящий список
    if isinstance(recomend, str) and recomend.startswith('[') and recomend.endswith(']'):
        try:
            recomend = ast.literal_eval(recomend)
        except:
            # Если не удалось преобразовать, оставляем как есть
            pass

    conclusions = data_dict.get('conclusion', [])

    for conclusion in conclusions:
        for category, content in conclusion.items():
            # Если ключ уже существует, добавляем к существующему списку
            if category not in func_dict:
                func_dict[category] = []

            # Ищем самый глубокий уровень вложенности
            last_key, last_value = get_last_key_value_pair(content)
            last_key = last_key.split(':', 1)[0]

            # Обрабатываем значения
            if isinstance(last_value, list):
                for sub_item_text in last_value:
                    sub_item_parts = sub_item_text.split(':', 1)[0]
                    # Добавляем только если такого элемента еще нет в списке
                    if sub_item_parts not in func_dict[category]:
                        func_dict[category].append(sub_item_parts)

    current_dir = os.path.dirname(os.path.abspath(__file__))

    docx_dir = os.path.join(settings.BASE_DIR, 'docx')
    os.makedirs(docx_dir, exist_ok=True)

    template_path = os.path.join(current_dir, 'template.docx')
    tpl = DocxTemplate(template_path)
    tpl.render({
        "p_data": p_data,
        "func_dict": func_dict,
        "recap": recap,
        "recomend": recomend
    })
    filename = f"{in_list[1]['fio']}_заключение.docx"
    file_path = os.path.join(docx_dir, filename)
    tpl.save(file_path)

    # Возвращаем путь к созданному файлу
    return file_path


