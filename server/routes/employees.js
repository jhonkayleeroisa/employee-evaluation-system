const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { verifyAdmin } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Get all employees
router.get('/', verifyAdmin, (req, res) => {
  db.all('SELECT * FROM employees ORDER BY firstName, lastName', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get single employee
router.get('/:id', verifyAdmin, (req, res) => {
  db.get('SELECT * FROM employees WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(row);
  });
});

// Create employee
router.post('/', verifyAdmin, (req, res) => {
  const { firstName, lastName, email, department, position } = req.body;

  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: 'First name, last name, and email are required' });
  }

  const id = uuidv4();

  db.run(
    `INSERT INTO employees (id, firstName, lastName, email, department, position)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, firstName, lastName, email, department || '', position || ''],
    (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.status(201).json({ id, firstName, lastName, email, department, position });
    }
  );
});

// Update employee
router.put('/:id', verifyAdmin, (req, res) => {
  const { firstName, lastName, email, department, position } = req.body;

  db.run(
    `UPDATE employees SET firstName = ?, lastName = ?, email = ?, department = ?, position = ?
     WHERE id = ?`,
    [firstName, lastName, email, department, position, req.params.id],
    (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ id: req.params.id, firstName, lastName, email, department, position });
    }
  );
});

// Delete employee
router.delete('/:id', verifyAdmin, (req, res) => {
  db.run('DELETE FROM employees WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Employee deleted' });
  });
});

module.exports = router;
