# Employee Evaluation System - GitHub Pages Deployment

## 📋 Overview

A full-stack employee evaluation system with **GitHub Pages deployment**.

- **Frontend**: React app hosted on GitHub Pages
- **Backend**: Node.js/Express server (runs locally or on a backend service)
- **Database**: SQLite
- **Email**: Nodemailer with Gmail SMTP

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- Git
- GitHub account
- Gmail account with app password

### 1. Setup Local Development

```bash
# Clone the repo
git clone https://github.com/jhonkayleeroisa/employee-evaluation-system.git
cd employee-evaluation-system

# Install all dependencies
npm install
cd client && npm install && cd ..
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_PATH=./employee-evaluation.db
JWT_SECRET=your-secret-key-here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password
EMAIL_FROM=noreply@yourcompany.com
APP_BASE_URL=http://localhost:3000
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Setup Gmail

1. Enable 2FA: https://myaccount.google.com/security
2. Generate app password: https://myaccount.google.com/apppasswords
3. Add to `.env` as `EMAIL_PASS`

### 4. Initialize Database

```bash
npm run db:init
```

### 5. Run Locally

```bash
# Terminal 1 - Backend
npm run server:dev

# Terminal 2 - Frontend
npm run client
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

**Login**: admin@evaluation-system.com / admin123

---

## 🌐 Deploy to GitHub Pages

### Step 1: Build the React App

```bash
npm run build
```

This creates a `client/build` folder ready for deployment.

### Step 2: Deploy to GitHub Pages

```bash
npm run deploy
```

The React app is now live at:
https://jhonkayleeroisa.github.io/employee-evaluation-system

### Step 3: Update GitHub Repository Settings

1. Go to repo Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` (auto-created by gh-pages)
4. Folder: `/ (root)`
5. Click Save

---

## 🔧 Deployment Considerations

### Backend API Location

For the frontend (hosted on GitHub Pages) to communicate with the backend API, you need to:

**Option A: Run Backend Locally (Development)**
- Backend runs on http://localhost:5000
- Frontend uses `REACT_APP_API_URL=http://localhost:5000/api`
- Only works when both are running locally

**Option B: Deploy Backend to Cloud (Production)**

Choose one:

1. **Heroku** (simple, free tier available)
   ```bash
   # Install Heroku CLI
   # Login
   heroku login
   
   # Create app
   heroku create your-app-name
   
   # Set environment variables
   heroku config:set JWT_SECRET=your-secret
   heroku config:set EMAIL_USER=your@gmail.com
   heroku config:set EMAIL_PASS=your-app-password
   
   # Deploy
   git push heroku main
   ```
   
   Then update `.env` to:
   ```env
   REACT_APP_API_URL=https://your-app-name.herokuapp.com/api
   ```

2. **Railway** (modern, easy deployment)
   - Connect GitHub repo
   - Set environment variables in dashboard
   - Auto-deploys on push

3. **Render** (free tier with sleep)
   - Deploy Node.js from GitHub
   - Set environment variables
   - Get API URL

4. **AWS Lambda + API Gateway**
   - Serverless backend
   - Pay per use

5. **DigitalOcean App Platform**
   - Droplet or app platform
   - Full control

---

## 📁 Project Structure

```
employee-evaluation-system/
├── server/                          # Node.js/Express backend
│   ├── db/
│   │   ├── connection.js
│   │   └── init.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── employees.js
│   │   ├── evaluators.js
│   │   ├── evaluations.js
│   │   └── notifications.js
│   ├── services/
│   │   ├── emailService.js
│   │   └── evaluationService.js
│   ├── index.js
│   └── package.json
├── client/                          # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.js
│   │   │   ├── DashboardPage.js
│   │   │   ├── EmployeesPage.js
│   │   │   ├── EvaluatorsPage.js
│   │   │   ├── TemplatesPage.js
│   │   │   ├── EvaluationFormPage.js
│   │   │   └── ReportsPage.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── build/                       # Production build (generated)
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🔐 Environment Variables

### Development (`.env`)
```env
PORT=5000
NODE_ENV=development
DATABASE_PATH=./employee-evaluation.db
JWT_SECRET=dev-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
EMAIL_FROM=noreply@yourcompany.com
APP_BASE_URL=http://localhost:3000
REACT_APP_API_URL=http://localhost:5000/api
```

### Production (GitHub Pages + Backend Service)

Update `.env` before deploying:
```env
NODE_ENV=production
JWT_SECRET=your-very-long-random-secret
REACT_APP_API_URL=https://your-backend-url.com/api
```

---

## 📧 Email Automation

### How It Works

1. Admin creates evaluation cycle
2. Admin assigns evaluators to employees
3. System automatically sends emails to evaluators
4. Evaluators receive link with unique token
5. Evaluators complete form (no auth required)
6. Evaluation saved to database
7. Admin views reports

### Email Flow

```
Admin Dashboard
      ↓
 Create Evaluation Cycle
      ↓
 Assign Evaluator → Employee
      ↓
Trigger Email (Nodemailer)
      ↓
Evaluator Receives Email
      ↓
Click Link → Opens Form
      ↓
Fill & Submit
      ↓
Save to Database
      ↓
Admin Views Report
```

---

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token
- `POST /api/auth/register` - Register new admin

### Employees
- `GET /api/employees` - List all
- `POST /api/employees` - Create
- `PUT /api/employees/:id` - Update
- `DELETE /api/employees/:id` - Delete

### Evaluators
- `GET /api/evaluators` - List all
- `POST /api/evaluators` - Create
- `PUT /api/evaluators/:id` - Update
- `DELETE /api/evaluators/:id` - Delete

### Evaluation Cycles
- `GET /api/evaluations/cycles` - List cycles
- `POST /api/evaluations/cycles` - Create cycle

### Assignments & Forms
- `POST /api/evaluations/assign` - Assign & send email
- `GET /api/evaluations/assignments/:cycleId` - Get assignments
- `GET /api/evaluations/token/:token` - Get form by token
- `POST /api/evaluations/submit/:token` - Submit form

### Notifications
- `GET /api/notifications` - List sent emails
- `POST /api/notifications/send-evaluations` - Batch send

---

## 🧪 Testing

### Test Workflow Locally

1. Login: admin@evaluation-system.com / admin123
2. Add employees
3. Add evaluators
4. Create evaluation cycle
5. Assign evaluator → employee (email will be sent)
6. Check your Gmail inbox
7. Click evaluation link
8. Fill form and submit
9. View report in admin dashboard

### Test Email (Without Gmail)

Edit `.env`:
```env
EMAIL_USER=test@ethereal.email
EMAIL_PASS=test-password
```

Use Ethereal (temp email service for testing).

---

## 🚀 Production Checklist

- [ ] Change default admin password
- [ ] Update `JWT_SECRET` to random 32+ char string
- [ ] Configure production email account
- [ ] Deploy backend to cloud service
- [ ] Update `REACT_APP_API_URL` in `.env`
- [ ] Build and deploy frontend to GitHub Pages
- [ ] Test complete workflow
- [ ] Setup CORS correctly for domain
- [ ] Enable HTTPS
- [ ] Monitor error logs

---

## 📊 Features

✅ Admin Dashboard with statistics
✅ Employee & Evaluator management
✅ Evaluation cycle creation
✅ Automatic email notifications
✅ Token-based form access (no login needed)
✅ Multi-criteria evaluation (1-5 rating)
✅ Comments/feedback section
✅ Submission tracking
✅ Reports & analytics
✅ JWT authentication
✅ SQLite database
✅ GitHub Pages deployment

---

## 🐛 Troubleshooting

### CORS Error
**Problem**: Frontend can't reach backend API

**Solution**:
1. Ensure backend is running on correct port
2. Check `REACT_APP_API_URL` matches backend URL
3. Verify backend has CORS enabled

### Email Not Sending
**Problem**: Evaluation emails fail

**Solution**:
1. Verify Gmail app password (16 chars)
2. Ensure 2FA is enabled on Gmail
3. Check `.env` EMAIL_* vars
4. Look at server logs for error details

### GitHub Pages Shows 404
**Problem**: Frontend deploys but shows not found

**Solution**:
1. Verify `homepage` in `package.json` is correct
2. Run `npm run deploy` again
3. Check GitHub Pages settings (gh-pages branch)
4. Clear browser cache

### Blank Page on GitHub Pages
**Problem**: App loads but shows nothing

**Solution**:
1. Check browser console for JavaScript errors
2. Verify backend API URL is accessible
3. Check network tab in DevTools
4. Ensure React Router basename matches homepage

---

## 📝 License

MIT
