import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db, firebaseInitialized } from "./firebase.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Local in-memory fallback storage
const localResumes = [];
const generateId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
    "http://127.0.0.1:5176",
    process.env.FRONTEND_URL || "http://localhost:5173"
  ],
  credentials: true
}));

// Allow any origin for development if strict list fails
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/health", (req, res) => {
  res.json({
    status: "Server is running!",
    timestamp: new Date(),
    database: firebaseInitialized ? "Firebase Firestore Connected" : "Local Storage Mode",
    firebase: firebaseInitialized ? "Enabled" : "Disabled"
  });
});

app.get("/api/resumes", async (req, res) => {
  try {
    if (!firebaseInitialized) {
      return res.json({ success: true, count: localResumes.length, data: localResumes });
    }

    const resumes = [];
    const snapshot = await db.collection("resumes").orderBy("createdAt", "desc").get();
    snapshot.forEach(doc => {
      const data = doc.data();
      resumes.push({ id: doc.id, ...data });
    });

    res.json({ success: true, count: resumes.length, data: resumes });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({ success: false, error: "Failed to fetch resumes", message: error.message });
  }
});

app.get("/api/resumes/:id", async (req, res) => {
  try {
    if (!firebaseInitialized) {
      const found = localResumes.find(r => r.id === req.params.id);
      if (!found) return res.status(404).json({ success: false, error: "Resume not found" });
      return res.json({ success: true, data: found });
    }

    const doc = await db.collection("resumes").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ success: false, error: "Resume not found" });

    res.json({ success: true, data: { id: doc.id, ...doc.data() } });
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({ success: false, error: "Failed to fetch resume", message: error.message });
  }
});

app.post("/api/resumes", async (req, res) => {
  try {
    const { name, email, phone, address, skills, experience, education, photoPreview } = req.body;

    if (!name || !name.trim()) return res.status(400).json({ success: false, error: "Name is required" });
    if (!email || !email.trim()) return res.status(400).json({ success: false, error: "Email is required" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ success: false, error: "Invalid email format" });

    const resumeData = { name: name.trim(), email: email.trim(), phone: phone?.trim() || "", address: address?.trim() || "", skills: skills?.trim() || "", experience: experience?.trim() || "", education: education?.trim() || "", photoPreview: photoPreview || null, createdAt: new Date(), updatedAt: new Date() };

    let savedResume;
    if (!firebaseInitialized) {
      const id = generateId();
      savedResume = { id, ...resumeData };
      localResumes.unshift(savedResume);
      console.log(`✅ Resume created locally: ${id}`);
    } else {
      const docRef = await db.collection("resumes").add(resumeData);
      savedResume = { id: docRef.id, ...resumeData };
      console.log(`✅ Resume created: ${docRef.id}`);
    }

    res.status(201).json({ success: true, message: "Resume created successfully", id: savedResume.id, data: savedResume });
  } catch (error) {
    console.error("Error creating resume:", error);
    res.status(500).json({ success: false, error: "Failed to create resume", message: error.message });
  }
});

app.put("/api/resumes/:id", async (req, res) => {
  try {
    const { name, email, phone, address, skills, experience, education, photoPreview } = req.body;
    if (!name || !email) return res.status(400).json({ success: false, error: "Name and email are required" });

    const resumeData = { name: name.trim(), email: email.trim(), phone: phone?.trim() || "", address: address?.trim() || "", skills: skills || "", experience: experience || "", education: education || "", photoPreview: photoPreview || null, updatedAt: new Date() };

    if (!firebaseInitialized) {
      const index = localResumes.findIndex((r) => r.id === req.params.id);
      if (index < 0) return res.status(404).json({ success: false, error: "Resume not found" });
      localResumes[index] = { ...localResumes[index], ...resumeData };
      console.log(`✅ Resume updated locally: ${req.params.id}`);
      return res.json({ success: true, message: "Resume updated successfully", id: req.params.id, data: localResumes[index] });
    }

    await db.collection("resumes").doc(req.params.id).update(resumeData);
    console.log(`✅ Resume updated: ${req.params.id}`);
    res.json({ success: true, message: "Resume updated successfully", id: req.params.id, data: { id: req.params.id, ...resumeData } });
  } catch (error) {
    console.error("Error updating resume:", error);
    res.status(500).json({ success: false, error: "Failed to update resume", message: error.message });
  }
});

app.delete("/api/resumes/:id", async (req, res) => {
  try {
    if (!firebaseInitialized) {
      const index = localResumes.findIndex((r) => r.id === req.params.id);
      if (index < 0) return res.status(404).json({ success: false, error: "Resume not found" });
      localResumes.splice(index, 1);
      console.log(`✅ Resume deleted locally: ${req.params.id}`);
      return res.json({ success: true, message: "Resume deleted successfully", id: req.params.id });
    }

    await db.collection("resumes").doc(req.params.id).delete();
    console.log(`✅ Resume deleted: ${req.params.id}`);
    res.json({ success: true, message: "Resume deleted successfully", id: req.params.id });
  } catch (error) {
    console.error("Error deleting resume:", error);
    res.status(500).json({ success: false, error: "Failed to delete resume", message: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: "Endpoint not found", path: req.path });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ success: false, error: "Internal server error", message: err.message });
});

const server = app.listen(PORT, () => {
  console.log("\n" + "=".repeat(50));
  console.log("🚀 Resume Builder API Server");
  console.log("=".repeat(50));
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`☁️  Database: ${firebaseInitialized ? "Firebase Firestore" : "Local Storage"}`);
  console.log("=".repeat(50) + "\n");
});

process.on("SIGINT", () => {
  console.log("\n👋 Server shutting down...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});
