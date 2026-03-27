# 🚀 AI Resume Builder - Setup & Deployment Guide

## What's Been Fixed

✅ Fixed import issues in App.jsx
✅ Fixed main.jsx duplicate component mounting
✅ Added proper form validation
✅ Created modern, responsive UI styling
✅ Built complete Express.js backend API
✅ Integrated Firebase Firestore database
✅ Added PDF download functionality
✅ Created .gitignore and environment files
✅ Initialized git repository
✅ All files committed and ready to push

## Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Create a Service Account:
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Download the JSON file
5. Add credentials to `server/.env`:
```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_key_id
FIREBASE_PRIVATE_KEY=your_private_key_here
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_CERT_URL=your_cert_url
PORT=5000
```

### 3. Frontend Environment

`client/.env.local` is already configured for local development:
```
VITE_API_URL=http://localhost:5000/api
```

For production, change to your deployed API URL.

### 4. Run Locally

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Backend runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Frontend runs on: http://localhost:5173

## Push to GitHub

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository:
   - Repository name: `ai-resume-builder`
   - Description: "AI-powered Resume Builder with Cloud Backend"
   - Choose visibility (Public/Private)
   - Don't initialize with README (we have one!)
3. Copy the repository URL

### Step 2: Push from Local

```bash
cd "c:\Users\acer\Desktop\resume"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/ai-resume-builder.git

# Rename branch to main (optional)
git branch -M main

# Push all commits
git push -u origin main
```

### Step 3: Generate GitHub Token (if using HTTPS)

If prompted for password:
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` scope
3. Use token as password when pushing

## Deployment Options

### Option 1: Deploy Backend on Render

1. Push to GitHub (Step above)
2. Go to [Render.com](https://render.com/)
3. Create New → Web Service
4. Connect GitHub repository
5. Configure:
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables: Add all from `.env`

### Option 2: Deploy Frontend on Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Import your GitHub project
3. Framework: Vite
4. Set Environment Variables:
   - `VITE_API_URL=your_render_api_url`
5. Deploy!

### Option 3: Deploy on Heroku (Backend)

```bash
heroku login
heroku create your-app-name
git push heroku main
heroku config:set FIREBASE_PROJECT_ID=xxx FIREBASE_PRIVATE_KEY=xxx ...
```

## API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resumes` | Get all resumes |
| GET | `/api/resumes/:id` | Get single resume |
| POST | `/api/resumes` | Create resume |
| PUT | `/api/resumes/:id` | Update resume |
| DELETE | `/api/resumes/:id` | Delete resume |
| GET | `/health` | Health check |

### Request/Response Examples

**Create Resume:**
```bash
curl -X POST http://localhost:5000/api/resumes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "skills": "React, Node.js, Firebase",
    "experience": "5+ years in web development",
    "education": "BS in Computer Science"
  }'
```

## Features

- ✨ Beautiful, modern UI with gradient background
- 📱 Fully responsive design (mobile, tablet, desktop)
- 📝 Real-time form validation
- 💾 Cloud storage with Firebase
- 🔐 Secure backend API
- 📥 Download resume as PDF
- ⚡ Fast performance with React & Vite
- 🎨 Professional styling with CSS3

## Tech Stack

- **Frontend**: React 19, Vite, Axios, html2canvas, jsPDF
- **Backend**: Node.js, Express.js, Firebase Admin SDK
- **Database**: Google Cloud Firestore
- **Deployment**: (Vercel, Render, Heroku, etc.)

## Troubleshooting

### CORS Issues
Make sure backend URL in `.env.local` matches the actual server URL.

### Firebase Connection Error
- Verify all credentials are correctly copied in `.env`
- Check that Firestore database is enabled in Firebase console
- Ensure service account has proper permissions

### Port Already in Use
- Check if port 5000 is available
- Change PORT in `.env` if needed

### Build Issues
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## Next Steps

1. ✅ Push code to GitHub
2. [Deploy backend](#deployment-options)
3. [Deploy frontend](#deployment-options)
4. Update production URLs in environment variables
5. Test live application
6. Share your resume builder!

## Support

For issues or questions, create an issue on GitHub or check the main [README.md](../README.md)

Happy Resume Building! 🎯
