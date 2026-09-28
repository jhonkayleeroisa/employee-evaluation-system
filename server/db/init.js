const db = require('./connection');
const fs = require('fs');
const path = require('path');

const initDatabase = () => {
  const tables = [
    // Employees table
    `CREATE TABLE IF NOT EXISTS employees (
      id TEXT PRIMARY KEY,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      department TEXT,
      position TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    // Evaluators table
    `CREATE TABLE IF NOT EXISTS evaluators (
      id TEXT PRIMARY KEY,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    // Evaluation Cycles table
    `CREATE TABLE IF NOT EXISTS evaluation_cycles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      startDate DATETIME NOT NULL,
      endDate DATETIME NOT NULL,
      status TEXT DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    // Evaluation Assignments table
    `CREATE TABLE IF NOT EXISTS evaluation_assignments (
      id TEXT PRIMARY KEY,
      evaluationCycleId TEXT NOT NULL,
      evaluatorId TEXT NOT NULL,
      employeeId TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'pending',
      ratings TEXT,
      comments TEXT,
      submittedAt DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (evaluationCycleId) REFERENCES evaluation_cycles(id),
      FOREIGN KEY (evaluatorId) REFERENCES evaluators(id),
      FOREIGN KEY (employeeId) REFERENCES employees(id)
    )`,

    // Email Notifications table
    `CREATE TABLE IF NOT EXISTS email_notifications (
      id TEXT PRIMARY KEY,
      evaluationAssignmentId TEXT NOT NULL,
      recipientEmail TEXT NOT NULL,
      subject TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      sentAt DATETIME,
      openedAt DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (evaluationAssignmentId) REFERENCES evaluation_assignments(id)
    )`,

    // Admin Users table
    `CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      firstName TEXT,
      lastName TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
  ];

  tables.forEach((tableSQL) => {
    db.run(tableSQL, (err) => {
      if (err) {
        console.error('Error creating table:', err);
      }
    });
  });

  // Insert default admin user if not exists
  const defaultAdmin = {
    id: 'admin-1',
    email: 'admin@evaluation-system.com',
    password: require('bcryptjs').hashSync('admin123', 8),
    firstName: 'Admin',
    lastName: 'User',
  };

  db.run(
    `INSERT OR IGNORE INTO admin_users (id, email, password, firstName, lastName)
     VALUES (?, ?, ?, ?, ?)`,
    [defaultAdmin.id, defaultAdmin.email, defaultAdmin.password, defaultAdmin.firstName, defaultAdmin.lastName],
    (err) => {
      if (err) {
        console.error('Error inserting default admin:', err);
      } else {
        console.log('✓ Database tables initialized');
        console.log('  Default admin: admin@evaluation-system.com / admin123');
      }
    }
  );
};

initDatabase();

module.exports = initDatabase;
