const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  const games = db.all('SELECT * FROM games');
  res.json(games);
});

router.get('/:id', (req, res) => {
  const game = db.get('SELECT * FROM games WHERE id = ?', [req.params.id]);
  if (!game) return res.status(404).json({ error: 'Игра не найдена' });
  res.json(game);
});

module.exports = router;
