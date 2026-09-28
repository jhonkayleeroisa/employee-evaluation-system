# Employee Evaluation System

A full-stack web application for managing employee evaluations with automated email notifications.

## Features

- **Admin Dashboard**: Manage employees, evaluators, and evaluation cycles
- **Evaluation Forms**: Dynamic forms for evaluators to submit employee assessments
- **Email Automation**: Automatic email notifications to evaluators with evaluation links
- **Evaluation Tracking**: Track evaluation status and completion
- **Reports & Analytics**: View evaluation results and generate reports
- **User Authentication**: Secure login for admins and evaluators

## Tech Stack

- **Frontend**: React, Axios, React Router
- **Backend**: Node.js, Express.js
- **Database**: SQLite (development) / PostgreSQL (production)
- **Email**: Nodemailer with SMTP
- **Authentication**: JWT tokens

## Project Structure

```
.
├── server/                    # Backend (Node.js/Express)
│   ├── db/                   # Database initialization
│   ├── routes/               # API routes
│   ├── controllers/          # Business logic
│   ├── middleware/           # Auth & validation
│   ├── services/             # Email & evaluation services
│   ├── models/               # Database models
│   └── index.js              # Server entry point
├── client/                    # Frontend (React)
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── .env.example              # Environment variables template
├── package.json              # Root dependencies
└── README.md
```

## Installation

### Prerequisites

- Node.js (v16+)
- npm or yarn
- SQLite3

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/jhonkayleeroisa/employee-evaluation-system.git
   cd employee-evaluation-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your email credentials and JWT secret.

4. **Initialize the database**
   ```bash
   npm run db:init
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

   This starts:
   - Backend server on `http://localhost:5000`
   - Frontend on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/verify` - Verify token

### Employees
- `GET /api/employees` - List all employees
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Evaluators
- `GET /api/evaluators` - List all evaluators
- `POST /api/evaluators` - Create evaluator
- `PUT /api/evaluators/:id` - Update evaluator
- `DELETE /api/evaluators/:id` - Delete evaluator

### Evaluations
- `GET /api/evaluations` - List evaluations
- `GET /api/evaluations/:id` - Get evaluation details
- `POST /api/evaluations` - Create evaluation cycle
- `PUT /api/evaluations/:id` - Update evaluation
- `GET /api/evaluations/token/:token` - Get evaluation by token (for evaluator forms)

### Email Notifications
- `POST /api/notifications/send-evaluations` - Send evaluation forms to evaluators
- `GET /api/notifications/status/:id` - Get notification status

## Usage

### For Admins

1. Log in to the admin dashboard
2. Add employees and evaluators
3. Create an evaluation cycle
4. Assign evaluators to employees
5. Send evaluation notifications (automated emails to evaluators)
6. Monitor evaluation completion
7. View reports and results

### For Evaluators

1. Receive email with evaluation link
2. Click link or use unique token
3. Fill out evaluation form
4. Submit evaluation
5. Receive confirmation

## Email Configuration

This system uses Nodemailer for sending emails. For Gmail:

1. Enable 2-factor authentication on your Google account
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Use the 16-character app password in `.env` as `EMAIL_PASS`

## Database Schema

### Employees Table
```sql
CREATE TABLE employees (
  id TEXT PRIMARY KEY,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  department TEXT,
  position TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Evaluators Table
```sql
CREATE TABLE evaluators (
  id TEXT PRIMARY KEY,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Evaluation Assignments Table
```sql
CREATE TABLE evaluation_assignments (
  id TEXT PRIMARY KEY,
  evaluationCycleId TEXT NOT NULL,
  evaluatorId TEXT NOT NULL,
  employeeId TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending',
  submittedAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (evaluationCycleId) REFERENCES evaluation_cycles(id),
  FOREIGN KEY (evaluatorId) REFERENCES evaluators(id),
  FOREIGN KEY (employeeId) REFERENCES employees(id)
);
```

## License

MIT
