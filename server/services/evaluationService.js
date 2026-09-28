const { v4: uuidv4 } = require('uuid');
const db = require('../db/connection');
const { sendEmail } = require('./emailService');

const generateEvaluationToken = () => {
  return uuidv4();
};

const sendEvaluationEmails = async (assignmentId, cycleId, evaluatorId, employeeId, token) => {
  const assignmentQuery = `
    SELECT a.*, e.firstName AS evaluatorFirstName, e.lastName AS evaluatorLastName, e.email AS evaluatorEmail,
           emp.firstName AS employeeFirstName, emp.lastName AS employeeLastName, emp.email AS employeeEmail,
           c.name AS cycleName
    FROM evaluation_assignments a
    INNER JOIN evaluators e ON a.evaluatorId = e.id
    INNER JOIN employees emp ON a.employeeId = emp.id
    INNER JOIN evaluation_cycles c ON a.evaluationCycleId = c.id
    WHERE a.id = ?
  `;

  return new Promise((resolve, reject) => {
    db.get(assignmentQuery, [assignmentId], async (err, assignment) => {
      if (err) {
        return reject(err);
      }

      if (!assignment) {
        return reject(new Error('Evaluation assignment not found'));
      }

      const evaluationLink = `${process.env.APP_BASE_URL || 'http://localhost:3000'}/evaluation/${token}`;
      const subject = `Performance Evaluation Request: ${assignment.employeeFirstName} ${assignment.employeeLastName}`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; border-radius: 8px;">
          <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">Performance Evaluation Request</h2>
            
            <p style="color: #374151;">Hello <strong>${assignment.evaluatorFirstName} ${assignment.evaluatorLastName}</strong>,</p>
            
            <p style="color: #374151;">You have been assigned to evaluate <strong style="color: #1f2937;">${assignment.employeeFirstName} ${assignment.employeeLastName}</strong> for the <strong style="color: #1f2937;">${assignment.cycleName}</strong> evaluation cycle.</p>
            
            <p style="color: #374151;">Please complete the evaluation form by clicking the button below:</p>
            
            <div style="text-align: center; margin: 24px 0;">
              <a href="${evaluationLink}" style="display: inline-block; background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600;">Complete Evaluation</a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              <strong>Evaluation Token:</strong> <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${token}</code>
            </p>
            
            <p style="color: #6b7280; font-size: 12px; margin-bottom: 0;">If the button doesn't work, copy and paste this link in your browser: <a href="${evaluationLink}" style="color: #2563eb;">${evaluationLink}</a></p>
          </div>
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 16px;">Employee Evaluation System</p>
        </div>
      `;

      const text = `Hello ${assignment.evaluatorFirstName} ${assignment.evaluatorLastName},\n\nYou have been assigned to evaluate ${assignment.employeeFirstName} ${assignment.employeeLastName} for the ${assignment.cycleName} evaluation cycle.\n\nPlease complete the evaluation at: ${evaluationLink}\n\nEvaluation Token: ${token}\n\nThank you.`;

      try {
        const emailResult = await sendEmail({
          to: assignment.evaluatorEmail,
          subject,
          html,
          text,
        });

        const notificationId = uuidv4();
        const status = emailResult.success ? 'sent' : 'failed';

        db.run(
          `INSERT INTO email_notifications (id, evaluationAssignmentId, recipientEmail, subject, status, sentAt, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
          [notificationId, assignmentId, assignment.evaluatorEmail, subject, status, status === 'sent' ? new Date().toISOString() : null],
          (error) => {
            if (error) {
              console.error('Error saving notification:', error.message);
            }
          }
        );

        resolve(emailResult);
      } catch (emailError) {
        reject(emailError);
      }
    });
  });
};

module.exports = { generateEvaluationToken, sendEvaluationEmails };
