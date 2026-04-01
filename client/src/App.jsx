import { useState, useEffect } from "react";
import ResumeForm from "./Resume";
import ResumePreview from "./ResumePreview";
import axios from "axios";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "/api" : "http://localhost:5000/api");

function App() {
  const [data, setData] = useState({});
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [mobileTab, setMobileTab] = useState("builder");
  const [formVersion, setFormVersion] = useState(0);

  // Show message notification
  const showMessage = (text, type = "success", duration = 3000) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), duration);
  };

  const readLocalResumes = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem("resumes") || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const startNewResume = () => {
    setData({});
    setFormVersion((v) => v + 1);
    setMobileTab("builder");
    window.scrollTo({ top: 0, behavior: "smooth" });
    showMessage("New resume form is ready", "info", 2200);
  };

  const openSavedResume = (resume) => {
    setData(resume || {});
    setMobileTab("builder");
    showMessage("Saved resume loaded", "success", 2200);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Fetch resumes from backend
  const fetchResumes = async () => {
    setLoading(true);
    try {
      // Load from localStorage first
      const localResumes = readLocalResumes();
      setResumes(localResumes);

      // Try to fetch from backend
      const response = await axios.get(`${API_URL}/resumes`);
      if (response.data.success) {
        const remoteResumes = Array.isArray(response.data.data) ? response.data.data : [];
        // Do not wipe valid local data with empty remote payloads.
        if (remoteResumes.length > 0 || localResumes.length === 0) {
          setResumes(remoteResumes);
          localStorage.setItem("resumes", JSON.stringify(remoteResumes));
        }
      }
    } catch (error) {
      console.error("Error fetching from server:", error);
      // Already loaded from localStorage
    } finally {
      setLoading(false);
    }
  };

  // Save resume to backend
  const saveResume = async (resumeData) => {
    setLoading(true);
    try {
      // Update preview immediately even if storage/network fails.
      setData({ ...resumeData });

      // Save to localStorage without photo (avoid quota issues with base64 data).
      const resumeForStorage = { ...resumeData };
      delete resumeForStorage.photoPreview;
      const localResumes = readLocalResumes();
      const cleanedLocalResumes = Array.isArray(localResumes)
        ? localResumes.map((r) => {
            const copy = { ...r };
            delete copy.photoPreview;
            return copy;
          })
        : [];
      const newResume = { ...resumeForStorage, id: Date.now() };
      cleanedLocalResumes.push(newResume);
      localStorage.setItem("resumes", JSON.stringify(cleanedLocalResumes.slice(-25)));
      setResumes([...cleanedLocalResumes.slice(-25)]);
      showMessage("✅ Resume saved successfully!", "success");

      // Sync to backend in background; local save already succeeded.
      axios.post(`${API_URL}/resumes`, resumeData, {
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 6000
      }).then((response) => {
        if (response?.data?.success) {
          showMessage("✅ Resume also saved to server!", "success");
        }
      }).catch((error) => {
        console.error("Background server sync failed:", error);
      });

      return newResume;
    } catch (error) {
      console.error("Error saving to server:", error);
      showMessage("Resume saved locally", "info");
      return { ...resumeData, id: Date.now() };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
    // Load last resume into data
    const localResumes = readLocalResumes();
    if (localResumes.length > 0) {
      setData(localResumes[localResumes.length - 1]);
    }
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🎯 Professional Resume Builder</h1>
        <p>Create and download your perfect resume in minutes</p>
      </header>

      {message && (
        <div className={`message-notification message-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="app-content">
        <div className="form-section">
          <div className="builder-actions">
            <button type="button" className="builder-btn" onClick={startNewResume}>
              + New Resume
            </button>
            <button type="button" className="builder-btn" onClick={() => setMobileTab("saved")}>
              Saved Resumes ({resumes.length})
            </button>
          </div>
          <ResumeForm key={formVersion} setData={saveResume} />
        </div>
        <div className={`preview-section ${mobileTab === "saved" ? "mobile-hidden" : ""}`}>
          <ResumePreview data={data} />
        </div>
        <div className={`saved-resume-section ${mobileTab === "saved" ? "mobile-show" : ""}`}>
          <div className="saved-header">
            <h3>Saved Resumes</h3>
            <button type="button" className="builder-btn" onClick={() => setMobileTab("builder")}>
              Back to Builder
            </button>
          </div>
          {resumes.length === 0 ? (
            <p className="saved-empty">No saved resumes yet.</p>
          ) : (
            <div className="saved-list">
              {resumes
                .slice()
                .reverse()
                .map((resume, index) => (
                  <div className="saved-item" key={resume.id || `${resume.name}-${index}`}>
                    <div>
                      <strong>{resume.name || "Untitled"}</strong>
                      <p>{resume.email || "No email"}</p>
                    </div>
                    <button type="button" className="builder-btn" onClick={() => openSavedResume(resume)}>
                      Open
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Processing...</p>
        </div>
      )}
    </div>
  );
}

export default App;