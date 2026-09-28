const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { verifyAdmin } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Get all evaluators
router.get('/', verifyAdmin, (req, res) => {
  db.all('SELECT * FROM evaluators ORDER BY firstName, lastName', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get single evaluator
router.get('/:id', verifyAdmin, (req, res) => {
  db.get('SELECT * FROM evaluators WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Evaluator not found' });
    }
    res.json(row);
  });
});

// Create evaluator
router.post('/', verifyAdmin, (req, res) => {
  const { firstName, lastName, email } = req.body;

  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: 'First name, last name, and email are required' });
  }

  const id = uuidv4();

  db.run(
    `INSERT INTO evaluators (id, firstName, lastName, email)
     VALUES (?, ?, ?, ?)`,
    [id, firstName, lastName, email],
    (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.status(201).json({ id, firstName, lastName, email });
    }
  );
});

// Update evaluator
router.put('/:id', verifyAdmin, (req, res) => {
  const { firstName, lastName, email } = req.body;

  db.run(
    `UPDATE evaluators SET firstName = ?, lastName = ?, email = ?
     WHERE id = ?`,
    [firstName, lastName, email, req.params.id],
    (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ id: req.params.id, firstName, lastName, email });
    }
  );
});

// Delete evaluator
router.delete('/:id', verifyAdmin, (req, res) => {
  db.run('DELETE FROM evaluators WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Evaluator deleted' });
  });
});

module.exports = router;
