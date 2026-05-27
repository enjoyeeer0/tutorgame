const express = require('express');
const cors = require('cors');
const { init } = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/games', require('./routes/games'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/guides', require('./routes/guides'));
app.use('/api/comments', require('./routes/comments'));

const PORT = 3000;

init().then(() => {
  app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Ошибка запуска БД:', err);
});
