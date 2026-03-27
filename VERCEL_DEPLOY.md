# Vercel Deployment Guide

## Frontend Deployment (React + Vite)

### Quick Deploy Steps:

1. **Install Vercel CLI** (if not installed):
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy Frontend**:
```bash
cd C:\Users\acer\Desktop\resume
vercel --prod
```

When prompted:
- **Project name**: `ai-resume-builder` (or your choice)
- **Framework**: Select `Vite`
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Root directory**: `./`

### Environment Variables in Vercel Dashboard:
- Go to project settings → Environment Variables
- Add:
  - `VITE_API_URL`: `http://localhost:5000/api` (for local testing)
  - Or set to deployed backend URL after backend is deployed

---

## Backend Deployment (Express.js)

### Deploy to Render.com or Heroku:

#### Option 1: Render (Free tier available)
1. Go to [render.com](https://render.com)
2. Create account and connect GitHub
3. Click "New +" → "Web Service"
4. Choose your repo
5. Settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
6. Add Environment Variables:
   ```
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY=your_private_key
   FIREBASE_CLIENT_EMAIL=your_email
   ```
7. Deploy

#### Option 2: Heroku (requires paid account)
```bash
cd server
heroku login
heroku create your-app-name
git push heroku main
heroku config:set FIREBASE_PROJECT_ID=your_project_id
heroku open
```

### Get Backend URL:
After deployment, you'll get a URL like: `https://your-app.render.app`

---

## Connect Frontend to Backend

After backend is deployed, update frontend environment:

1. In Vercel Dashboard → `ai-resume-builder` → Settings → Environment Variables
2. Add:
   ```
   VITE_API_URL=https://your-backend-url/api
   ```
3. Redeploy frontend:
   ```bash
   vercel --prod
   ```

---

## Test Deployment

```bash
# Test backend health
curl https://your-backend-url/health

# Test API
curl https://your-backend-url/api/resumes
```

---

## Firebase Setup for Cloud Storage

To enable cloud storage instead of local fallback:

1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Create service account and download JSON
3. Add environment variables to your backend service:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_PRIVATE_KEY`
   - `FIREBASE_CLIENT_EMAIL`
   - etc.

---

## Troubleshooting

- **CORS error**: Check backend CORS origins
- **API connection refused**: Ensure backend URL is correct in `VITE_API_URL`
- **Firebase not working**: Verify all env vars are set in backend service
- **Build fails**: Check that `client/package.json` and `server/package.json` have all deps

---

## Summary

```bash
# Frontend
vercel --prod

# Backend (after setup on Render/Heroku)
# Visit service dashboard and add env vars
# Then deploy/redeploy

# Update frontend with backend URL
vercel env add VITE_API_URL https://your-backend-url/api
vercel --prod
```

Done! Your resume builder is now live!
