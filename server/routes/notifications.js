const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { verifyAdmin } = require('../middleware/auth');

// Get all notification records
router.get('/', verifyAdmin, (req, res) => {
  db.all(
    `SELECT * FROM email_notifications ORDER BY createdAt DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// Send evaluation notifications for all assignments in a cycle
router.post('/send-evaluations', verifyAdmin, async (req, res) => {
  const { evaluationCycleId } = req.body;

  if (!evaluationCycleId) {
    return res.status(400).json({ error: 'evaluationCycleId is required' });
  }

  db.all(
    `SELECT * FROM evaluation_assignments WHERE evaluationCycleId = ?`,
    [evaluationCycleId],
    async (err, assignments) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!assignments.length) {
        return res.status(404).json({ error: 'No evaluation assignments found for this cycle' });
      }

      const results = [];

      for (const assignment of assignments) {
        try {
          const result = await require('../services/evaluationService').sendEvaluationEmails(
            assignment.id,
            assignment.evaluationCycleId,
            assignment.evaluatorId,
            assignment.employeeId,
            assignment.token
          );
          results.push({ assignmentId: assignment.id, status: 'sent', result });
        } catch (error) {
          results.push({ assignmentId: assignment.id, status: 'failed', error: error.message });
        }
      }

      res.json({ message: 'Notifications processed', results });
    }
  );
});

module.exports = router;
