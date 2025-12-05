FROM python:3.11-slim

# Устанавливаем все необходимые зависимости, включая libxml2
RUN apt-get update && apt-get install -y \
    unixodbc \
    unixodbc-common \
    libxml2 \
    libpam0g \
    libcrypt1 \
    libstdc++6 \
    libgcc-s1 \
    libc6 \
    && rm -rf /var/lib/apt/lists/*

# Копируем и распаковываем драйвер DB2
COPY linuxx64_odbc_cli.tar.gz /tmp/
RUN mkdir -p /opt/ibm/db2 \
    && tar -xzf /tmp/linuxx64_odbc_cli.tar.gz -C /opt/ibm/db2 \
    && rm /tmp/linuxx64_odbc_cli.tar.gz

# Создаем правильный odbcinst.ini
RUN echo '[IBM DB2 ODBC DRIVER]' > /etc/odbcinst.ini \
    && echo 'Description = IBM DB2 ODBC Driver' >> /etc/odbcinst.ini \
    && echo 'Driver = /opt/ibm/db2/clidriver/lib/libdb2.so' >> /etc/odbcinst.ini \
    && echo 'Threading = 0' >> /etc/odbcinst.ini

# Устанавливаем переменные окружения
ENV LD_LIBRARY_PATH=/opt/ibm/db2/clidriver/lib:$LD_LIBRARY_PATH
ENV ODBCSYSINI=/etc

# Проверяем зависимости после установки
RUN echo "=== Проверка зависимостей ===" && \
    ldd /opt/ibm/db2/clidriver/lib/libdb2.so && \
    echo "" && \
    echo "=== Проверка файлов ===" && \
    ls -la /opt/ibm/db2/clidriver/lib/libdb2.so && \
    echo "" && \
    echo "=== Проверка odbcinst.ini ===" && \
    cat /etc/odbcinst.ini

WORKDIR /app
COPY requirements.txt lab_data_interpreter-0.1.0-py3-none-any.whl .
RUN pip install --no-cache-dir -r requirements.txt lab_data_interpreter-0.1.0-py3-none-any.whl

COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]