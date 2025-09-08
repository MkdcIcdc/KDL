def splitter(incoming_string):
    """Основная функция для парсинга измерений"""
    # Преобразуем кортеж в список
    if incoming_string:
        data_list = incoming_string[0].split('\r\n')
    else:
        data_list = []

    # Парсим измерения
    results = {}
    index = 0
    for item in data_list:
        if item.strip() and ':' in item:
            name_part, value_part = item.split(':', 1)
            name = name_part.strip()
            value_parts = value_part.strip().split(' ', 1)

            results[index] = {
                'name': name,
                'value': value_parts[0],
                'unit': value_parts[1] if len(value_parts) > 1 else ''
            }
            index += 1

    return results