const express = require('express');
const cors = require('cors');
const db = require('../backend/database');

const app = express();
app.use(cors());
app.use(express.json());

// Подключаем все роуты из backend
app.use('/api/games',      require('../backend/routes/games'));
app.use('/api/categories', require('../backend/routes/categories'));
app.use('/api/guides',     require('../backend/routes/guides'));
app.use('/api/comments',   require('../backend/routes/comments'));

// Инициализируем БД один раз на весь жизненный цикл функции
let initPromise = null;

module.exports = async (req, res) => {
  if (!initPromise) {
    initPromise = db.init();
  }
  await initPromise;
  return app(req, res);
};
