# TutorGame — База знаний для геймеров

Учебный проект. Сайт-справочник с гайдами, билдами и советами по популярным играм.

**Стек:** Vue 3 + Node.js + Express + SQLite (sql.js)

---

## Структура проекта

```
tutorgame/
├── frontend/        — Vue 3 приложение (Vite)
├── backend/         — Node.js + Express сервер
│   ├── server.js    — точка входа бэкенда
│   ├── database.js  — SQLite база данных (sql.js)
│   └── routes/      — маршруты API
├── api/             — серверная функция для Vercel
├── package.json     — зависимости бэкенда
└── vercel.json      — конфигурация деплоя
```

---

## Запуск локально

### Требования

- [Node.js](https://nodejs.org) версии 18 или выше
- Git

Проверь что установлено:
```bash
node -v
git -v
```

---

### Шаг 1 — Клонировать репозиторий

```bash
git clone https://github.com/enjoyeeer0/tutorgame.git
cd tutorgame
```

---

### Шаг 2 — Установить зависимости

Сначала зависимости бэкенда (в корне проекта):
```bash
npm install
```

Затем зависимости фронтенда:
```bash
cd frontend
npm install
cd ..
```

---

### Шаг 3 — Запустить бэкенд и фронтенд

Нужно открыть **два отдельных терминала**.

**Терминал 1 — бэкенд:**
```bash
node backend/server.js
```
Ожидаемый вывод:
```
Server running on port 3000
База данных создана: 6 игр, 18 гайдов
```

**Терминал 2 — фронтенд:**
```bash
cd frontend
npm run dev
```
Ожидаемый вывод:
```
  VITE v5.x.x  ready in ...ms

  ➜  Local:   http://localhost:5173/
```

---

### Шаг 4 — Открыть сайт

Открой браузер и перейди по адресу:
```
http://localhost:5173
```

---

## Запуск в VS Code

1. Открой папку проекта: **File → Open Folder** → выбери папку `tutorgame`
2. Открой встроенный терминал: **Ctrl + `** (backtick)
3. Нажми **+** чтобы открыть второй терминал
4. В первом терминале запусти бэкенд, во втором — фронтенд (команды из Шага 3)

---

## База данных

SQLite база данных создаётся **автоматически** при первом запуске бэкенда.

Файл базы: `backend/gameguides.db`

Что создаётся автоматически:
- 6 игр: Minecraft, Dota 2, Elden Ring, Escape from Tarkov, Arc Raiders, Dark Souls III
- 4 категории: Гайд, Билд, Совет, Прохождение
- 18 гайдов с реальным контентом

Если нужно сбросить базу — удали файл `backend/gameguides.db` и перезапусти сервер.

---

## API эндпоинты

| Метод | Маршрут | Описание |
|-------|---------|----------|
| GET | /api/games | Список всех игр |
| GET | /api/categories | Список категорий |
| GET | /api/guides | Список гайдов (фильтры: game_id, category_id, search) |
| GET | /api/guides/:id | Один гайд |
| GET | /api/comments/:guide_id | Комментарии к гайду |
| POST | /api/comments/:guide_id | Добавить комментарий |

---

## Технологии

| Часть | Технология |
|-------|-----------|
| Фронтенд | Vue 3 (Composition API, script setup) |
| Роутинг | Vue Router 4 |
| HTTP-запросы | Axios |
| Сборка фронтенда | Vite |
| Бэкенд | Node.js + Express |
| База данных | SQLite через sql.js (чистый JavaScript, без C++ компиляции) |
| Стили | CSS с glassmorphism-эффектами |
