# Firebase Firestore Setup Guide

## Step 1: Create Firebase Project

1. Go to **[Firebase Console](https://console.firebase.google.com/)**
2. Click **Create a project**
3. Enter project name: `Resume Builder`
4. Accept the default settings
5. Wait for project creation (takes ~1-2 minutes)

---

## Step 2: Enable Firestore Database

1. In Firebase Console, go to **Build** > **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
   - ⚠️ Note: Change to production mode before deploying!
4. Choose location (closest to you)
5. Click **Create**

---

## Step 3: Create Service Account

### What is a Service Account?
A Service Account is like a special user account for your server to authenticate with Firebase.

### Steps:

1. In Firebase Console, click **Project Settings** (gear icon ⚙️)
2. Go to **Service Accounts** tab
3. Click **Generate New Private Key**
4. A JSON file will download
5. **Save this file securely** - it's sensitive!

---

## Step 4: Get Your Credentials

Open the downloaded JSON file and copy these values:

```json
{
  "type": "service_account",
  "project_id": "your_project_id_here",
  "private_key_id": "your_key_id_here",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "your_service_account_email@...iam.gserviceaccount.com",
  "client_id": "your_client_id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/certificates/..."
}
```

---

## Step 5: Configure Your Backend

### Create `.env` file in `server/` directory:

```bash
# Navigate to server directory
cd server

# Create .env file with your values (Windows):
# Use Notepad: notepad .env

# On Linux/Mac:
# nano .env
```

### Paste this into `.env` file:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY=your_private_key_with_escaped_newlines
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_CERT_URL=your_cert_url

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Important: Handle the Private Key

The `private_key` field has special characters that need escaping:

**From JSON:**
```
"private_key": "-----BEGIN PRIVATE KEY-----\nMIF...ABC\n-----END PRIVATE KEY-----\n"
```

**In .env file, paste it exactly as is** (with \n characters):
```
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIF...ABC\n-----END PRIVATE KEY-----\n
```

---

## Step 6: Test Your Connection

1. Start the backend:
```bash
cd server
npm run dev
```

2. You should see:
```
==================================================
🚀 Resume Builder API Server
==================================================
✅ Server running on http://localhost:5000
📝 API available at http://localhost:5000/api
🏥 Health check: http://localhost:5000/health
☁️  Database: Firebase Firestore
==================================================
```

3. Test the health check:
```bash
curl http://localhost:5000/health
```

Should respond with:
```json
{
  "status": "Server is running!",
  "timestamp": "2024-01-01T...",
  "database": "Firebase Firestore Connected"
}
```

---

## Step 7: Verify Firestore Connection

Once you create a resume in the app:

1. Go back to Firebase Console
2. Click **Firestore Database**
3. You should see a collection called `resumes`
4. Inside will be documents with all your resume data!

Example data structure:
```
resumes/
  ├── doc_id_1/
  │   ├── name: "John Doe"
  │   ├── email: "john@example.com"
  │   ├── skills: "React, Node.js"
  │   ├── createdAt: timestamp
  │   └── ...
  │
  └── doc_id_2/
      └── ...
```

---

## Troubleshooting

### Error: "Firebase initialization error"
**Solution:**
- Check all values in `.env` are correct
- Make sure `.env` file exists in server directory
- Verify private key is complete (no characters missing)

### Error: "PERMISSION_DENIED: Missing or insufficient permissions"
**Solution:**
- Go to Firestore > Rules
- Make sure they allow read/write (for test mode, this is default)
- Rule should be:
```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null || request.time < timestamp.date(2025, 2, 27);
    }
  }
}
```

### Error: ".env file not found"
**Solution:**
1. Make sure you're in the `server` directory
2. Create `.env` file:
   - Windows: Use Notepad and save as `.env`
   - Linux/Mac: `touch .env` then edit

### Error: "Cannot find module 'firebase-admin'"
**Solution:**
```bash
cd server
npm install
```

---

## Security Tips

⚠️ **Important:**
- Never commit `.env` file to GitHub
- Never share your Firebase credentials
- The `.env` file is already in `.gitignore`
- In production, use environment variables instead of `.env` file

---

## Next Steps

✅ Firebase configured?  
✅ Backend running?  
✅ Resumes saving to Firestore?

Now you can:
1. Start the frontend: `cd client && npm run dev`
2. Create and download resumes
3. Deploy to production (see SETUP.md)

---

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Getting Started](https://firebase.google.com/docs/firestore/start)
- [Service Account Setup](https://firebase.google.com/docs/admin/setup)

