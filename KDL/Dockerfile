# Используем официальный Python
FROM python:3.11-slim

# Устанавливаем зависимости
WORKDIR /app
COPY requirements.txt .
COPY lab_data_interpreter-0.1.0-py3-none-any.whl .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install lab_data_interpreter-0.1.0-py3-none-any.whl

# Копируем весь проект
COPY . .

# Команда для запуска сервера (можно менять на gunicorn для продакшена)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]