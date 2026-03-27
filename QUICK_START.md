# 🚀 Quick Start Guide - AI Resume Builder

## ✨ What's New!

✅ **Photo Upload** - Add your professional photo to your resume  
✅ **Professional UI** - Modern, beautiful, and responsive design  
✅ **Real-time Preview** - See changes instantly as you type  
✅ **PDF Download** - Export your resume as PDF with one click  
✅ **Cloud Storage** - All data securely stored in Firebase  
✅ **Full Backend API** - Complete REST API with error handling  

---

## 🔧 Installation (Local Development)

### Step 1: Setup Firebase (Required!)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable **Firestore Database** (Start in test mode for development)
4. Create a **Service Account**:
   - Click **Project Settings** (gear icon)
   - Go to **Service Accounts** tab
   - Click **Generate New Private Key**
   - Save the JSON file safely

### Step 2: Configure Backend

```bash
cd server
npm install

# Create .env file and add Firebase credentials
cat > .env << EOF
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_key_id
FIREBASE_PRIVATE_KEY=your_private_key_with_escaped_newlines
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_CERT_URL=your_cert_url
PORT=5000
NODE_ENV=development
EOF

# Start backend
npm run dev
```

**Backend will run on:** `http://localhost:5000`

### Step 3: Configure Frontend

```bash
cd client
npm install

# Frontend already configured in .env.local
# Verify it points to correct API
cat .env.local
# Should show: VITE_API_URL=http://localhost:5000/api

# Start frontend
npm run dev
```

**Frontend will run on:** `http://localhost:5173`

---

## 🎯 How to Use

### Create a Resume:

1. **Upload Photo** (Optional)
   - Click the photo upload area
   - Select a JPG, PNG, or GIF (max 5MB)

2. **Fill Personal Info**
   - Full Name (required)
   - Email (required)
   - Phone Number (optional)
   - Address (optional)

3. **Add Professional Details**
   - Skills (required) - comma separated
   - Experience (required) - describe your work history
   - Education (required) - your educational background

4. **Generate Resume**
   - Click "Generate Resume" button
   - See live preview on the right
   - Green success message confirms it was saved to the cloud!

5. **Download or Print**
   - **Download PDF** - Save to your computer
   - **Print** - Print directly to PDF or printer

---

## 📋 Project Structure

```
resume-builder/
├── client/                    # React Frontend (Vite)
│   ├── src/
│   │   ├── App.jsx           # Main app component
│   │   ├── Resume.jsx        # Form component with photo upload
│   │   ├── ResumePreview.jsx # Resume preview with PDF export
│   │   ├── App.css           # Main styling
│   │   ├── Resume.css        # Form styling
│   │   └── ResumePreview.css # Preview styling
│   ├── .env.local            # Frontend config (pre-configured)
│   └── package.json
│
├── server/                    # Node.js Backend (Express)
│   ├── server.js             # Main API server
│   ├── firebase.js           # Firebase initialization
│   ├── .env                  # Backend config (you need to create)
│   └── package.json
│
├── README.md                 # Full documentation
├── SETUP.md                  # Deployment guide
└── QUICK_START.md            # This file
```

---

## 🔌 API Endpoints

### Base URL: `http://localhost:5000/api`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Check if server is running |
| GET | `/resumes` | Get all resumes |
| GET | `/resumes/:id` | Get specific resume |
| POST | `/resumes` | Create new resume |
| PUT | `/resumes/:id` | Update resume |
| DELETE | `/resumes/:id` | Delete resume |

### Create Resume Example:
```bash
curl -X POST http://localhost:5000/api/resumes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St, City, State",
    "skills": "React, Node.js, JavaScript, Firebase",
    "experience": "Senior Developer at Tech Company (2020-Present): Led team of 5 developers...",
    "education": "Bachelor of Science in Computer Science, University (2015)",
    "photoPreview": "data:image/png;base64,..." // optional base64 image
  }'
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'firebase-admin'"
```bash
cd server
npm install
```

### Issue: "API Connection Error"
Make sure:
- Backend is running: `npm run dev` in `/server`
- Frontend .env.local has correct API URL
- Check browser console for exact error

### Issue: "Firebase Credentials Error"
- Verify .env file has all required fields
- Check Firebase credentials are valid
- Ensure Firestore database is enabled in Firebase console

### Issue: "Photo Upload Failed"
- File size must be less than 5MB
- Must be an image file (JPG, PNG, GIF)
- Check browser console for errors

### Issue: "PDF Download Not Working"
- Try refreshing the page
- Make sure all resume fields are filled
- Check browser's popup blocker

---

## 🎨 Features Explained

### Photo Upload
- Supports JPG, PNG, GIF formats
- Max 5MB file size
- Displayed in resume header
- Optional field

### Professional styling
- Modern gradient background
- Clean, readable layout
- Responsive design (works on mobile)
- Professional fonts and colors

### Real-time Validation
- Email format checking
- Required field validation
- Real-time error messages
- Success notifications

### PDF Generation
- Multi-page support (handles long resumes)
- Print-friendly styling
- Professional formatting
- Preserves all content including photos

---

## 📱 Responsive Design

Works perfectly on:
- **Desktop** (1920px and above)
- **Laptop** (1024px to 1920px)
- **Tablet** (768px to 1024px)
- **Mobile** (Below 768px)

---

## 🔒 Data Privacy

- All data stored in Firebase Firestore
- No personal data shared
- Encrypted connection (HTTPS in production)
- Data owned by you

---

## ✅ Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads at http://localhost:5173
- [ ] Can upload a photo
- [ ] Can fill in all form fields
- [ ] Can generate resume
- [ ] Resume preview shows all information
- [ ] Can download PDF
- [ ] Photo appears in resume header
- [ ] Success message shown after creating resume
- [ ] Can see stored resumes in Firestore

---

## 🚀 Next Steps

1. ✅ Local testing complete?
2. 📤 [Deploy to production](./SETUP.md)
3. 🌐 Share your resume builder!

---

## 📞 Need Help?

Check these files:
- [Full Documentation](./README.md)
- [Deployment Guide](./SETUP.md)
- [Firebase Setup](./SETUP.md#firebase-setup)

Happy Resume Building! 🎯✨
