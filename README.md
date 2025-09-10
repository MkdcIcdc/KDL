# 📋 Оглавление
 - [Возможности](#-возможности)
 - [Требования](#-требования)
 - [Установка и запуск](#-установка-и-запуск)
 - [API Документация](#-api-документация)
 - [Примеры использования](#-примеры-использования)
 - [Troubleshooting](#-troubleshooting)
 - [Разработка](#-разработка)

## 🌟 Возможности
✅ CRUD операции для пользователей \
✅ Валидация данных на стороне сервера \
✅ SQLite база данных - легкая и portable \
✅ RESTful API с JSON форматом \
✅ CORS поддержка для фронтенд приложений \
✅ Обработка ошибок с детальной информацией \
✅ Валидация email и проверка уникальности 

## 🛠 Требования
Docker \
Python 3.11 или выше \
PostgreSQL 15 или выше \
NodeJS 20 или выше \
Git для клонирования репозитория

## 🚀 Установка и запуск
### 1. Клонирование и настройка
```bash
# Клонируйте репозиторий
git clone https://github.com/MkdcIcdc/KDL.git
cd KDL
```
### 2. Запуск приложения
```bash
# Простой запуск
go run main.go
```
#### Запуск с определенным портом
```bash
export PORT=3000
go run main.go
```
#### Или для Windows
```bash
set PORT=3000
go run main.go
```
#### Сборка бинарника
```bash
go build -o app .
./app
```
### 3. Проверка работы
Откройте браузер или выполните:

```bash
curl http://localhost:8080/api/v1/users
```
## 📖 API Документация
Базовый URL
http://localhost:8080/api/v1
Модель данных пользователя
```json
{
  "id": 1,
  "name": "Иван Иванов",
  "email": "ivan@example.com",
  "age": 25,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```
### Эндпоинты
#### 🟢 GET /users
Получить всех пользователей

Ответ:

```json
[
  {
    "id": 1,
    "name": "Иван Иванов",
    "email": "ivan@example.com",
    "age": 25,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```
🟢 GET /users/{id}\
Получить пользователя по ID

Параметры:

id - ID пользователя (integer)

Ответ:

```json
{
  "id": 1,
  "name": "Иван Иванов",
  "email": "ivan@example.com",
  "age": 25,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```
🟡 POST /users
Создать нового пользователя

Тело запроса:

```json
{
  "name": "Иван Иванов",
  "email": "ivan@example.com",
  "age": 25
}
```
Валидация:

name: обязательное, 2-100 символов\
email: обязательное, валидный формат\
age: опциональное, 0-150

🟠 PUT /users/{id}\
Обновить пользователя

Тело запроса:

```json
{
  "name": "Новое имя",
  "email": "new@example.com",
  "age": 26
}
```
Примечание: Можно обновлять отдельные поля

🔴 DELETE /users/{id}\
Удалить пользователя

Ответ:

```json
{
  "message": "Пользователь удален"
}
```
## 💡 Примеры использования
PowerShell примеры
```powershell
# 1. Создание пользователя
$body = @{
    name = "Иван Иванов"
    email = "ivan@example.com"
    age = 25
} | ConvertTo-Json

irm http://localhost:8080/api/v1/users -Method POST -Headers @{"Content-Type"="application/json"} -Body $body
```

### 2. Получение всех пользователей
```powershell
irm http://localhost:8080/api/v1/users
```

### 3. Обновление пользователя
```powershell
$updateBody = @{
    name = "Иван Петров"
    age = 26
} | ConvertTo-Json

irm http://localhost:8080/api/v1/users/1 -Method PUT -Headers @{"Content-Type"="application/json"} -Body $updateBody
```

### 4. Удаление пользователя
```powershell
irm http://localhost:8080/api/v1/users/1 -Method DELETE
```
## curl примеры

### Создание пользователя
```bash
curl -X POST http://localhost:8080/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Иван Иванов","email":"ivan@example.com","age":25}'
```
### Получение пользователей
```bash
curl http://localhost:8080/api/v1/users
```
### Обновление пользователя
```bash
curl -X PUT http://localhost:8080/api/v1/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Новое имя","age":26}'
```
### Удаление пользователя
```bash
curl -X DELETE http://localhost:8080/api/v1/users/1
```
### JavaScript пример
```javascript
// Создание пользователя
fetch('http://localhost:8080/api/v1/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: 'Иван Иванов',
        email: 'ivan@example.com',
        age: 25
    })
})
.then(response => response.json())
.then(data => console.log(data));
```
## 🔧 Troubleshooting

❌ Ошибка: "Port already in use"
Решение:

```bash
# Используйте другой порт
set PORT=3000
go run main.go
```

Или найдите и завершите процесс
```bash
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```
❌ Ошибка: "go: cannot find module"\
Решение:

```bash
# Обновите зависимости
go mod tidy

# Или установите вручную
go get modernc.org/sqlite
go get github.com/gorilla/mux
go get github.com/rs/cors
```
❌ Ошибка валидации\
Пример ответа:

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Неверный формат email"
    }
  ]
}
```
Решение: Проверьте формат данных согласно требованиям валидации

❌ Ошибка: "User already exists"\
Решение: Используйте уникальный email адрес

❌ Ошибка: "Database locked"\
Решение: Убедитесь что база данных не используется другим процессом

❌ CORS ошибки во фронтенде\
Решение: Убедитесь что фронтенд делает запросы на правильный URL и порт

## 🛠 Разработка
### Структура проекта
```text
my-sqlite-app/
├── database/
│   ├── database.go      # Подключение к БД
│   ├── handlers.go      # HTTP обработчики
│   ├── validation.go    # Валидация данных
│   └── types.go         # Модели данных
├── main.go              # Точка входа
└── go.mod              # Зависимости
```
### Добавление новых функций
Новая модель данных: Добавьте в types.go\
Валидация: Реализуйте в validation.go\
Обработчики: Создайте в handlers.go\
Маршруты: Добавьте в main.go

## Тестирование

### Запустите сервер
```bash
go run main.go
```
### В отдельном терминале тестируйте API
```bash
./test_requests.ps1
```
## 📝 Лицензия
MIT License - смотрите файл LICENSE для деталей.

## 🤝 Поддержка
Если у вас возникли проблемы:
 - Проверьте секцию Troubleshooting
 - Убедитесь что все зависимости установлены
 - Проверьте что порт 8080 свободен
 - Для багрепортов и feature requests создайте issue в репозитории проекта.

