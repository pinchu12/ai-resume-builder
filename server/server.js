import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./firebase.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Increase payload size for images
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    process.env.FRONTEND_URL || "http://localhost:5173"
  ],
  credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "Server is running!", 
    timestamp: new Date(),
    database: "Firebase Firestore Connected"
  });
});

// Get all resumes
app.get("/api/resumes", async (req, res) => {
  try {
    const resumes = [];
    const snapshot = await db.collection("resumes").orderBy("createdAt", "desc").get();
    
    snapshot.forEach(doc => {
      const data = doc.data();
      resumes.push({
        id: doc.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      });
    });
    
    res.json({
      success: true,
      count: resumes.length,
      data: resumes
    });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch resumes",
      message: error.message 
    });
  }
});

// Get single resume
app.get("/api/resumes/:id", async (req, res) => {
  try {
    const doc = await db.collection("resumes").doc(req.params.id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ 
        success: false,
        error: "Resume not found" 
      });
    }
    
    res.json({
      success: true,
      data: {
        id: doc.id,
        ...doc.data()
      }
    });
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch resume",
      message: error.message 
    });
  }
});

// Create resume
app.post("/api/resumes", async (req, res) => {
  try {
    const { name, email, phone, address, skills, experience, education, photoPreview } = req.body;
    
    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ 
        success: false,
        error: "Name is required" 
      });
    }
    
    if (!email || !email.trim()) {
      return res.status(400).json({ 
        success: false,
        error: "Email is required" 
      });
    }
    
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid email format" 
      });
    }

    if (!skills || !skills.trim()) {
      return res.status(400).json({ 
        success: false,
        error: "Skills are required" 
      });
    }

    if (!experience || !experience.trim()) {
      return res.status(400).json({ 
        success: false,
        error: "Experience is required" 
      });
    }

    if (!education || !education.trim()) {
      return res.status(400).json({ 
        success: false,
        error: "Education is required" 
      });
    }
    
    const resumeData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || "",
      address: address?.trim() || "",
      skills: skills.trim(),
      experience: experience.trim(),
      education: education.trim(),
      photoPreview: photoPreview || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await db.collection("resumes").add(resumeData);
    
    console.log(`✅ Resume created: ${docRef.id}`);
    
    res.status(201).json({
      success: true,
      message: "Resume created successfully",
      id: docRef.id,
      data: {
        id: docRef.id,
        ...resumeData
      }
    });
  } catch (error) {
    console.error("Error creating resume:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to create resume",
      message: error.message 
    });
  }
});

// Update resume
app.put("/api/resumes/:id", async (req, res) => {
  try {
    const { name, email, phone, address, skills, experience, education, photoPreview } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ 
        success: false,
        error: "Name and email are required" 
      });
    }
    
    const resumeData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || "",
      address: address?.trim() || "",
      skills: skills || "",
      experience: experience || "",
      education: education || "",
      photoPreview: photoPreview || null,
      updatedAt: new Date()
    };
    
    await db.collection("resumes").doc(req.params.id).update(resumeData);
    
    console.log(`✅ Resume updated: ${req.params.id}`);
    
    res.json({
      success: true,
      message: "Resume updated successfully",
      id: req.params.id,
      data: {
        id: req.params.id,
        ...resumeData
      }
    });
  } catch (error) {
    console.error("Error updating resume:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to update resume",
      message: error.message 
    });
  }
});

// Delete resume
app.delete("/api/resumes/:id", async (req, res) => {
  try {
    await db.collection("resumes").doc(req.params.id).delete();
    console.log(`✅ Resume deleted: ${req.params.id}`);
    
    res.json({ 
      success: true,
      message: "Resume deleted successfully",
      id: req.params.id
    });
  } catch (error) {
    console.error("Error deleting resume:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to delete resume",
      message: error.message 
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: "Endpoint not found",
    path: req.path 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ 
    success: false,
    error: "Internal server error",
    message: err.message 
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log("\n" + "=".repeat(50));
  console.log("🚀 Resume Builder API Server");
  console.log("=".repeat(50));
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`☁️  Database: Firebase Firestore`);
  console.log("=".repeat(50) + "\n");
});

process.on("SIGINT", () => {
  console.log("\n👋 Server shutting down...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});
