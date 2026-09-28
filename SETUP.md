# Employee Evaluation System - Setup Guide

## 🚀 Quick Start

Follow these steps to get the evaluation system up and running.

### Prerequisites

- **Node.js** v16 or higher
- **npm** or **yarn**
- A Gmail account (for email automation)

### Step 1: Clone Repository

```bash
git clone https://github.com/jhonkayleeroisa/employee-evaluation-system.git
cd employee-evaluation-system
```

### Step 2: Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..

# Install server dependencies
cd server
npm install
cd ..
```

### Step 3: Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# Server
PORT=5000
NODE_ENV=development
DATABASE_PATH=./evaluation.db
JWT_SECRET=your_unique_jwt_secret_change_in_production

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_app_password
EMAIL_FROM=noreply@evaluation-system.com
APP_BASE_URL=http://localhost:3000

# Client
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 4: Setup Gmail for Email Automation

**Important:** Gmail requires an App Password for third-party apps.

1. Enable 2-Factor Authentication on your Google Account:
   - Go to [myaccount.google.com/security](https://myaccount.google.com/security)
   - Click "2-Step Verification"
   - Follow the setup process

2. Generate an App Password:
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Windows Computer" (or your device)
   - Google will generate a 16-character password
   - Copy this and paste into `.env` as `EMAIL_PASS`

3. Update your `.env`:
   ```env
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx
   ```

### Step 5: Initialize Database

```bash
cd server
node db/init.js
cd ..
```

This creates the SQLite database with all required tables and adds a default admin user:
- **Email:** `admin@evaluation-system.com`
- **Password:** `admin123`

### Step 6: Start the Application

**Option A: Development Mode (Recommended)**

```bash
npm run dev
```

This runs both frontend and backend in parallel:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

**Option B: Start Separately**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm start
```

### Step 7: Access the Application

Open http://localhost:3000 in your browser

**Login with:**
- Email: `admin@evaluation-system.com`
- Password: `admin123`

---

## 📋 Workflow

### For Administrators:

1. **Login** to the dashboard
2. **Manage Employees** - Add/edit/remove employees
3. **Manage Evaluators** - Add/edit/remove evaluators (can be managers or senior staff)
4. **Create Evaluation Cycle** - Define cycle name, start/end dates, and description
5. **Assign Evaluations** - Link evaluators to employees and automatically send emails
6. **View Reports** - Track evaluation completion and review submitted evaluations

### For Evaluators:

1. **Receive Email** - Automatic notification with evaluation link
2. **Open Form** - Click link or visit the form using unique token
3. **Fill Evaluation** - Rate employee on predefined criteria (1-5)
4. **Add Comments** - Provide detailed feedback
5. **Submit** - Complete and submit evaluation

---

## 🏗️ Project Structure

```
employee-evaluation-system/
├── server/                          # Node.js/Express backend
│   ├── db/
│   │   ├── connection.js           # Database connection setup
│   │   └── init.js                 # Database initialization
│   ├── middleware/
│   │   └── auth.js                 # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js                 # Authentication endpoints
│   │   ├── employees.js            # Employee CRUD operations
│   │   ├── evaluators.js           # Evaluator CRUD operations
│   │   ├── evaluations.js          # Evaluation cycles and assignments
│   │   └── notifications.js        # Email notification endpoints
│   ├── services/
│   │   ├── emailService.js         # Email sending via SMTP
│   │   └── evaluationService.js    # Evaluation logic
│   ├── index.js                    # Server entry point
│   └── package.json
│
├── client/                          # React frontend
│   ├── public/
│   │   └── index.html              # HTML template
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.js        # Admin login
│   │   │   ├── DashboardPage.js    # Dashboard overview
│   │   │   ├── EmployeesPage.js    # Manage employees
│   │   │   ├── EvaluatorsPage.js   # Manage evaluators
│   │   │   ├── TemplatesPage.js    # Create cycles & assign evaluations
│   │   │   ├── EvaluationFormPage.js # Public evaluation form
│   │   │   └── ReportsPage.js      # View evaluation reports
│   │   ├── services/
│   │   │   └── api.js              # Axios API client
│   │   ├── App.js                  # Main app component
│   │   ├── index.js                # React entry point
│   │   └── index.css               # Global styles
│   ├── package.json
│   └── .env
│
├── .env.example                     # Environment variables template
├── .gitignore
├── package.json                     # Root package.json
├── README.md
└── SETUP.md                         # This file
```

---

## 🗄️ Database Schema

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

### Evaluation Cycles Table
```sql
CREATE TABLE evaluation_cycles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  startDate DATETIME NOT NULL,
  endDate DATETIME NOT NULL,
  status TEXT DEFAULT 'pending',
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
  ratings TEXT,
  comments TEXT,
  submittedAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (evaluationCycleId) REFERENCES evaluation_cycles(id),
  FOREIGN KEY (evaluatorId) REFERENCES evaluators(id),
  FOREIGN KEY (employeeId) REFERENCES employees(id)
);
```

### Email Notifications Table
```sql
CREATE TABLE email_notifications (
  id TEXT PRIMARY KEY,
  evaluationAssignmentId TEXT NOT NULL,
  recipientEmail TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  sentAt DATETIME,
  openedAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (evaluationAssignmentId) REFERENCES evaluation_assignments(id)
);
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token validity
- `POST /api/auth/register` - Register new admin (setup only)

### Employees
- `GET /api/employees` - List all employees
- `GET /api/employees/:id` - Get single employee
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Evaluators
- `GET /api/evaluators` - List all evaluators
- `GET /api/evaluators/:id` - Get single evaluator
- `POST /api/evaluators` - Create evaluator
- `PUT /api/evaluators/:id` - Update evaluator
- `DELETE /api/evaluators/:id` - Delete evaluator

### Evaluation Cycles
- `GET /api/evaluations/cycles` - List all cycles
- `POST /api/evaluations/cycles` - Create evaluation cycle

### Evaluation Assignments
- `GET /api/evaluations/assignments/:cycleId` - Get assignments for cycle
- `POST /api/evaluations/assign` - Create assignment & send email
- `GET /api/evaluations/:id` - Get assignment details
- `GET /api/evaluations/token/:token` - Get evaluation form by token
- `POST /api/evaluations/submit/:token` - Submit evaluation form

### Notifications
- `GET /api/notifications` - List all notifications
- `POST /api/notifications/send-evaluations` - Send batch notifications for cycle

---

## 🛠️ Troubleshooting

### Email Not Sending

1. **Check .env configuration:**
   ```bash
   cat .env | grep EMAIL
   ```

2. **Verify Gmail App Password is correct:**
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Make sure you're signed in
   - Ensure 2FA is enabled

3. **Check server logs:**
   ```bash
   npm run dev
   ```
   Look for email error messages.

4. **Test email service:**
   ```bash
   curl -X POST http://localhost:5000/api/notifications/send-evaluations \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"evaluationCycleId": "cycle-id"}'
   ```

### Database Lock Error

1. Delete the database file:
   ```bash
   rm evaluation.db
   ```

2. Reinitialize:
   ```bash
   npm run db:init
   ```

### Port Already in Use

1. Find process using port 5000:
   ```bash
   lsof -i :5000
   ```

2. Kill the process:
   ```bash
   kill -9 <PID>
   ```

3. Or change PORT in `.env`:
   ```env
   PORT=5001
   ```

---

## 📦 Production Deployment

### Before Deploying

1. **Change default admin password:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@yourcompany.com","password":"strong_password","firstName":"Admin","lastName":"User"}'
   ```

2. **Update environment variables:**
   ```env
   NODE_ENV=production
   JWT_SECRET=your_very_long_random_secret_key
   DATABASE_PATH=/var/lib/app/evaluation.db
   ```

3. **Use PostgreSQL instead of SQLite:**
   - Update `db/connection.js` to use PostgreSQL driver
   - Update connection string in `.env`

4. **Enable HTTPS:**
   - Use a reverse proxy (nginx, Apache)
   - Setup SSL certificates

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server/index.js"]
```

---

## 📧 Email Template Customization

Edit `server/services/evaluationService.js` to customize email templates:

```javascript
const html = `
  <div style="font-family: Arial, sans-serif;">
    <h2>Custom Header</h2>
    <p>Custom message to evaluators...</p>
    <a href="${evaluationLink}">Complete Evaluation</a>
  </div>
`;
```

---

## 🤝 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review GitHub Issues: [Issues](https://github.com/jhonkayleeroisa/employee-evaluation-system/issues)
3. Contact the development team

---

## 📄 License

MIT License - See LICENSE file for details
