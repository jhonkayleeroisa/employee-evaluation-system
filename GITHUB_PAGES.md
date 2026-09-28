# Deploy to GitHub Pages - Step-by-Step

## Prerequisites

✅ Node.js v16+
✅ Git installed
✅ GitHub account
✅ Repository cloned locally

---

## Step 1: Install Dependencies

```bash
cd employee-evaluation-system
npm install
cd client && npm install && cd ..
```

---

## Step 2: Build the React Frontend

```bash
npm run build
```

This creates `client/build/` folder with optimized production files.

---

## Step 3: Install gh-pages Deployment Tool

```bash
npm install gh-pages --save-dev
```

*(Already in package.json)*

---

## Step 4: Deploy to GitHub Pages

```bash
npm run deploy
```

This:
1. Builds the React app
2. Creates a `gh-pages` branch
3. Pushes the build folder to that branch
4. Your site is now live!

---

## Step 5: Verify Deployment in GitHub

1. Go to your repository: https://github.com/jhonkayleeroisa/employee-evaluation-system
2. Click **Settings** → **Pages**
3. Under "Source", select:
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
4. Click **Save**

---

## Step 6: Access Your Site

🎉 Your site is now live at:

```
https://jhonkayleeroisa.github.io/employee-evaluation-system
```

---

## Step 7: Setup Backend API

Since GitHub Pages hosts only static files, your React frontend needs a backend API.

### Option A: Local Backend (Development)

Run backend locally:
```bash
npm run server:dev
```

Set in `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Note**: Only works when backend is running locally.

### Option B: Deploy Backend to Cloud (Production)

**Recommended Platforms**:

#### 1. **Heroku** (Easy, Free Tier Available)

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create new app
heroku create your-evaluation-api

# Set environment variables
heroku config:set JWT_SECRET=your-random-secret
heroku config:set EMAIL_USER=your@gmail.com
heroku config:set EMAIL_PASS=app-password
heroku config:set EMAIL_FROM=noreply@company.com

# Deploy
git push heroku main
```

Then update `.env`:
```env
REACT_APP_API_URL=https://your-evaluation-api.herokuapp.com/api
```

#### 2. **Railway** (Modern, Easy)

1. Sign up: https://railway.app
2. Connect GitHub repo
3. Set environment variables in dashboard
4. Get deployed URL
5. Update `.env`

#### 3. **Render** (Free Tier)

1. Sign up: https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub
4. Select this repo
5. Set environment variables
6. Deploy

#### 4. **AWS/Google Cloud/Azure**

For enterprise deployments.

---

## Step 8: Redeploy After Backend Change

After deploying backend and getting API URL:

1. Update `.env`:
   ```env
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

2. Rebuild and redeploy:
   ```bash
   npm run deploy
   ```

---

## Full Local Development Workflow

```bash
# Terminal 1: Start Backend
npm run server:dev

# Terminal 2: Start Frontend (development server)
npm run client
```

Access at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000/api

---

## Full Production Workflow

```bash
# 1. Setup backend on cloud service (e.g., Heroku, Railway, Render)
# 2. Get backend URL

# 3. Update .env with backend URL
# REACT_APP_API_URL=https://your-backend.example.com/api

# 4. Build and deploy frontend
npm run deploy

# 5. Site is live at:
# https://jhonkayleeroisa.github.io/employee-evaluation-system
```

---

## Troubleshooting

### Issue: "Cannot find module 'gh-pages'"
**Solution**:
```bash
npm install gh-pages --save-dev
```

### Issue: CORS Error on GitHub Pages
**Problem**: Frontend can't reach backend API

**Solution**:
1. Ensure backend URL is accessible from browser
2. Backend must have CORS enabled for GitHub Pages domain
3. Add to backend `server/index.js`:
   ```javascript
   app.use(cors({ origin: ['https://jhonkayleeroisa.github.io'] }));
   ```

### Issue: 404 Error on GitHub Pages
**Solution**:
1. Verify `homepage` in `package.json` is correct
2. Check GitHub Pages settings (gh-pages branch selected)
3. Clear browser cache
4. Wait 5-10 minutes for DNS propagation

### Issue: Blank Page, Console Shows Errors
**Solution**:
1. Check browser DevTools Console for errors
2. Verify backend API URL is correct
3. Ensure backend is running/deployed
4. Check Network tab to see failed requests

---

## Quick Commands Reference

```bash
# Development
npm run server:dev          # Start backend dev server
npm run client              # Start frontend dev server
npm run dev                 # Start both (requires concurrently)

# Production
npm run build               # Build React app
npm run deploy              # Deploy to GitHub Pages

# Database
npm run db:init             # Initialize SQLite database

# Utilities
npm run server              # Run backend (production mode)
```

---

## Next Steps

1. ✅ Deploy frontend to GitHub Pages
2. ✅ Deploy backend to cloud service
3. ✅ Update `.env` with backend URL
4. ✅ Test complete workflow
5. ✅ Configure custom domain (optional)
6. ✅ Setup CI/CD for auto-deployment (optional)

---

## Support

For issues:
1. Check GitHub Issues
2. Review troubleshooting above
3. Check backend logs
4. Check browser console
5. Check network requests in DevTools

