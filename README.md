# AI Resume Builder

A modern, cloud-based resume builder with PDF export functionality.

## Features

- 🎨 Beautiful, responsive UI
- 📄 Create professional resumes
- 💾 Save resumes to cloud (Firebase Firestore)
- 📥 Download resume as PDF
- ⚡ Built with React and Vite
- 🔥 Real-time backend API with Express.js
- ☁️ Cloud database integration (Firebase)

## Project Structure

```
ai_resume_builder/
├── client/           # React frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Resume.jsx
│   │   ├── ResumePreview.jsx
│   │   └── styles
│   └── package.json
├── server/          # Node.js/Express backend
│   ├── server.js
│   ├── firebase.js
│   ├── package.json
│   └── .env
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Firebase account

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with Firebase credentials:
```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
PORT=5000
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## API Endpoints

### Get all resumes
```
GET /api/resumes
```

### Get single resume
```
GET /api/resumes/:id
```

### Create resume
```
POST /api/resumes
Body: { name, email, phone, skills, experience, education }
```

### Update resume
```
PUT /api/resumes/:id
Body: { name, email, phone, skills, experience, education }
```

### Delete resume
```
DELETE /api/resumes/:id
```

## Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Create a service account and download JSON key
4. Add credentials to `.env` file in the server directory

## Building for Production

### Frontend
```bash
cd client
npm run build
```

### Backend
Ensure `.env` file is configured and run:
```bash
npm start
```

## Technologies Used

- **Frontend**: React 19, Vite, Axios
- **Backend**: Express.js, Node.js
- **Database**: Firebase Firestore
- **PDF Generation**: html2canvas, jsPDF
- **Styling**: CSS3

## License

MIT

## Author

Your Name
