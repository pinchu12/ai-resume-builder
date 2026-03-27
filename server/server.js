import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./firebase.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.FRONTEND_URL || "http://localhost:5173"
  ],
  credentials: true
}));
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Server is running!" });
});

// Get all resumes
app.get("/api/resumes", async (req, res) => {
  try {
    const resumes = [];
    const snapshot = await db.collection("resumes").get();
    
    snapshot.forEach(doc => {
      resumes.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(resumes);
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get single resume
app.get("/api/resumes/:id", async (req, res) => {
  try {
    const doc = await db.collection("resumes").doc(req.params.id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: "Resume not found" });
    }
    
    res.json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create resume
app.post("/api/resumes", async (req, res) => {
  try {
    const { name, email, phone, skills, experience, education } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    
    const resumeData = {
      name,
      email,
      phone: phone || "",
      skills: skills || "",
      experience: experience || "",
      education: education || "",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await db.collection("resumes").add(resumeData);
    
    res.status(201).json({
      id: docRef.id,
      ...resumeData
    });
  } catch (error) {
    console.error("Error creating resume:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update resume
app.put("/api/resumes/:id", async (req, res) => {
  try {
    const { name, email, phone, skills, experience, education } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    
    const resumeData = {
      name,
      email,
      phone: phone || "",
      skills: skills || "",
      experience: experience || "",
      education: education || "",
      updatedAt: new Date()
    };
    
    await db.collection("resumes").doc(req.params.id).update(resumeData);
    
    res.json({
      id: req.params.id,
      ...resumeData
    });
  } catch (error) {
    console.error("Error updating resume:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete resume
app.delete("/api/resumes/:id", async (req, res) => {
  try {
    await db.collection("resumes").doc(req.params.id).delete();
    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Error deleting resume:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api`);
});
