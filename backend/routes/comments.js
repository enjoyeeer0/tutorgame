const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/:guide_id', (req, res) => {
  const comments = db.all(
    'SELECT * FROM comments WHERE guide_id = ? ORDER BY created_at ASC',
    [Number(req.params.guide_id)]
  );
  res.json(comments);
});

router.post('/:guide_id', (req, res) => {
  const { author, content } = req.body;
  if (!author || !content) {
    return res.status(400).json({ error: 'Заполни имя и комментарий' });
  }
  const id = db.run(
    'INSERT INTO comments (guide_id, author, content) VALUES (?, ?, ?)',
    [Number(req.params.guide_id), author, content]
  );
  res.status(201).json(db.get('SELECT * FROM comments WHERE id = ?', [id]));
});

module.exports = router;
