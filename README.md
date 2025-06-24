# Fullstack Project

Цей репозиторій містить два проекти:

- **API** - backend на NestJS
- **Web** - frontend на NextJS

## Структура проекту

```
/
├── api/          # NestJS API backend
├── web/          # NextJS frontend
└── README.md
```

## Вимоги

- Node.js (версія 18 або вище)
- npm або yarn

## Налаштування та запуск

### 1. API (NestJS Backend)

#### Встановлення залежностей

```bash
cd api
npm install
```

#### Налаштування змінних середовища

Створіть файл `.env` в папці `api/` з наступним вмістом:

```env
MEAL_API_BASE_URL=https://www.themealdb.com/api/json/v1/1
FRONTEND_URL=http://localhost:3000
```

#### Запуск

```bash
# Режим розробки
npm run start:dev

# Продакшн
npm run build
npm run start:prod
```

API буде доступне за адресою: `http://localhost:3001`

### 2. Web (NextJS Frontend)

#### Встановлення залежностей

```bash
cd web
npm install
```

#### Налаштування змінних середовища

Створіть файл `.env.local` в папці `web/` з наступним вмістом:

```env
API_BASE_URL=http://localhost:3001/api
```

#### Запуск

```bash
# Режим розробки
npm run dev

# Продакшн
npm run build
npm run start
```

Frontend буде доступний за адресою: `http://localhost:3000`

## Порядок запуску

**Важливо:** Спочатку запустіть API, потім Web проект, оскільки frontend залежить від backend API.

1. Запустіть API сервер:

```bash
cd api
npm run start:dev
```

2. В новому терміналі запустіть Web проект:

```bash
cd web
npm run dev
```

## Тестування

### Тестування API

```bash
cd api
npm test                  # Запуск unit тестів
```

### Тестування Frontend

```bash
cd web
npm run test             # Запуск unit тестів
```

### Інтеграційне тестування

Для повного тестування функціональності:

1. **Запустіть API сервер**:

```bash
cd api
npm run start:dev
```

2. **Перевірте API endpoints**:

   - Відкрийте Swagger UI: `http://localhost:3001/api/swagger`
   - Протестуйте доступні ендпоінти безпосередньо з документації

3. **Запустіть Frontend**:

```bash
cd web
npm run dev
```

4. **Протестуйте повну функціональність**:
   - Відкрийте браузер на `http://localhost:3000`
   - Перевірте, що frontend успішно взаємодіє з API
   - Протестуйте всі функції додатка (пошук, відображення даних, тощо)

## API Documentation

### Swagger UI

API документація доступна через Swagger UI за адресою: `http://localhost:3001/api/swagger`

Swagger надає інтерактивну документацію з можливістю:

- Переглядати всі доступні ендпоінти
- Тестувати API запiti безпосередньо з браузера
- Переглядати схеми даних та моделі

### API Endpoints

API використовує дані з TheMealDB API. Основні ендпоінти будуть доступні за адресою `http://localhost:3001/api/`

## Скрипти

### API проект

- `npm run start` - запуск в продакшн режимі
- `npm run start:dev` - запуск в режимі розробки з hot reload
- `npm run build` - збірка проекту
- `npm test` - запуск тестів

### Web проект

- `npm run dev` - запуск в режимі розробки
- `npm run build` - збірка проекту
- `npm run start` - запуск збудованого проекту
- `npm run lint` - перевірка коду
- `npm run test` - запуск тестів

## Troubleshooting

### Помилки з портами

- Переконайтеся, що порти 3000 та 3001 вільні
- Якщо потрібно змінити порт API, не забудьте оновити `API_BASE_URL` в web проекті

### Помилки з підключенням

- Перевірте, що API сервер запущений перед запуском web проекту
- Перевірте правильність URL в змінних середовища
