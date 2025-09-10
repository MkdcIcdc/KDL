# Используем официальный Python
FROM python:3.11

# Устанавливаем зависимости
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем весь проект
COPY . .

# Команда для запуска сервера (можно менять на gunicorn для продакшена)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]