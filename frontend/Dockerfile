FROM node:20

# Рабочая директория
WORKDIR /app

# Копируем package.json и package-lock.json
COPY kdl/package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь React проект
COPY kdl/ ./

# Открываем порт dev-сервера
EXPOSE 3000

# Запуск dev-сервера React
CMD ["npm", "start"]