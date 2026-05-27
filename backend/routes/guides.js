const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  const { game_id, category_id, search } = req.query;
  let query = `
    SELECT guides.*, games.name as game_name, categories.name as category_name
    FROM guides
    JOIN games ON guides.game_id = games.id
    JOIN categories ON guides.category_id = categories.id
    WHERE 1=1
  `;
  const params = [];

  if (game_id) { query += ' AND guides.game_id = ?'; params.push(Number(game_id)); }
  if (category_id) { query += ' AND guides.category_id = ?'; params.push(Number(category_id)); }
  if (search) {
    query += ' AND (guides.title LIKE ? OR guides.content LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY guides.created_at DESC';
  res.json(db.all(query, params));
});

router.get('/:id', (req, res) => {
  const guide = db.get(`
    SELECT guides.*, games.name as game_name, categories.name as category_name
    FROM guides
    JOIN games ON guides.game_id = games.id
    JOIN categories ON guides.category_id = categories.id
    WHERE guides.id = ?
  `, [Number(req.params.id)]);

  if (!guide) return res.status(404).json({ error: 'Гайд не найден' });
  res.json(guide);
});

router.post('/', (req, res) => {
  const { title, content, author, game_id, category_id } = req.body;
  if (!title || !content || !author || !game_id || !category_id) {
    return res.status(400).json({ error: 'Заполни все поля' });
  }
  const id = db.run(
    'INSERT INTO guides (title, content, author, game_id, category_id) VALUES (?, ?, ?, ?, ?)',
    [title, content, author, Number(game_id), Number(category_id)]
  );
  res.status(201).json(db.get('SELECT * FROM guides WHERE id = ?', [id]));
});

router.delete('/:id', (req, res) => {
  const guide = db.get('SELECT * FROM guides WHERE id = ?', [Number(req.params.id)]);
  if (!guide) return res.status(404).json({ error: 'Гайд не найден' });
  db.run('DELETE FROM comments WHERE guide_id = ?', [Number(req.params.id)]);
  db.run('DELETE FROM guides WHERE id = ?', [Number(req.params.id)]);
  res.json({ message: 'Гайд удалён' });
});

module.exports = router;
