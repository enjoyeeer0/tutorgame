const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  const categories = db.all('SELECT * FROM categories');
  res.json(categories);
});

module.exports = router;
