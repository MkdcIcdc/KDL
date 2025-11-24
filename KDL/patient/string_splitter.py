def splitter(incoming_string):
    """Основная функция для парсинга измерений"""
    if not incoming_string:
        return {}

    # Преобразуем строку в список
    data_list = incoming_string.split('\r\n')

    # Парсим измерения
    results = {}
    index = 0
    for item in data_list:
        if item.strip() and ':' in item:
            try:
                name_part, value_part = item.split(':', 1)
                name = name_part.strip()
                value_parts = value_part.strip().split(' ', 1)

                results[index] = {
                    'name': name,
                    'value': value_parts[0],
                    'unit': value_parts[1] if len(value_parts) > 1 else ''
                }
                index += 1
            except (ValueError, IndexError):
                # Пропускаем некорректные строки
                continue

    return results