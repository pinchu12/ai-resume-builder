import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ResumeForm from "./Resume";
import ResumePreview from "./ResumePreview";
import axios from "axios";
import "./App.css";
import { useTemplateStore } from "./store/templateStore";
import { templates } from "./data/templates";

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "/api" : "http://localhost:5000/api");

function App() {
  const location = useLocation();
  const selectedTemplate = useTemplateStore((state) => state.selectedTemplate);
  const [data, setData] = useState({});
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState("builder");
  const [menuOpen, setMenuOpen] = useState(false);
  const [resumeMode, setResumeMode] = useState("general");
  const [formVersion, setFormVersion] = useState(0);
  const [activeTemplate, setActiveTemplate] = useState(null);

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
    setCurrentPage("builder");
    window.scrollTo({ top: 0, behavior: "smooth" });
    showMessage("New resume form is ready", "info", 2200);
  };

  const openSavedResume = (resume) => {
    setData(resume || {});
    setCurrentPage("builder");
    showMessage("Saved resume loaded", "success", 2200);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectModeOption = (mode) => {
    setResumeMode(mode);
    setMenuOpen(false);
    startNewResume();
  };

  const openResumeInNewTab = (resume) => {
    if (!resume) return;
    const appUrl = window.location.href;
    const escapeHtml = (value = "") =>
      String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");

    const newWindow = window.open("", "_blank");
    if (!newWindow) {
      showMessage("Popup blocked. Allow popups to open resume page.", "error", 3000);
      return;
    }

    const html = `<!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(resume.name || "Resume")}</title>
        <style>
          body{font-family:Arial,sans-serif;background:#f5f7fb;padding:20px;margin:0;color:#111827}
          .card{max-width:860px;margin:0 auto;background:#fff;border:1px solid #dbe4ef;border-radius:12px;padding:20px}
          .top-actions{max-width:860px;margin:0 auto 12px;display:flex;justify-content:flex-end;gap:8px}
          .top-actions a{background:#1f6feb;color:#fff;text-decoration:none;padding:8px 12px;border-radius:8px;font-weight:600}
          h1,h2,h3{margin:0 0 10px}
          .meta{color:#4b5563;margin-bottom:14px}
          .section{margin:16px 0}
          .photo{width:120px;height:120px;border-radius:10px;object-fit:cover;border:2px solid #1f6feb}
        </style>
      </head>
      <body>
        <div class="top-actions">
          <a href="${escapeHtml(appUrl)}">Back to Builder</a>
        </div>
        <div class="card">
          ${resume.photoPreview ? `<img class="photo" src="${resume.photoPreview}" alt="Photo" />` : ""}
          <h1>${escapeHtml(resume.name || "Untitled")}</h1>
          <div class="meta">${escapeHtml(resume.email || "")}${resume.phone ? " | " + escapeHtml(resume.phone) : ""}</div>
          <div class="section"><h3>Address</h3><p>${escapeHtml(resume.address || "N/A")}</p></div>
          <div class="section"><h3>Skills</h3><p>${escapeHtml(resume.skills || "N/A")}</p></div>
          <div class="section"><h3>Experience</h3><p>${escapeHtml(resume.experience || "N/A")}</p></div>
          <div class="section"><h3>Education</h3><p>${escapeHtml(resume.education || "N/A")}</p></div>
        </div>
      </body>
      </html>`;

    newWindow.document.open();
    newWindow.document.write(html);
    newWindow.document.close();
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
      setCurrentPage("saved");
      showMessage("✅ Resume saved successfully!", "success");
      openResumeInNewTab({ ...resumeData, id: newResume.id });

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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const templateId = params.get("templateId");
    if (!templateId) return;

    // Prefer store template, fallback to static data by templateId for hard reloads.
    const resolvedTemplate =
      (selectedTemplate && selectedTemplate.id === templateId && selectedTemplate) ||
      templates.find((item) => item.id === templateId) ||
      null;

    if (resolvedTemplate) {
      setActiveTemplate(resolvedTemplate);
      showMessage(`Template selected: ${resolvedTemplate.name}`, "info", 2500);
    }
  }, [location.search, selectedTemplate]);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-row">
          <div>
            <h1>🎯 Professional Resume Builder</h1>
            <p>Create and download your perfect resume in minutes</p>
          </div>
        </div>
      </header>

      <div className="menu-wrap menu-fixed">
        <button type="button" className="menu-btn" onClick={() => setMenuOpen((v) => !v)}>
          ⋮ Menu
        </button>
        {menuOpen && (
          <div className="menu-dropdown">
            <button type="button" onClick={() => { setCurrentPage("saved"); setMenuOpen(false); }}>
              Saved Resumes
            </button>
            <button type="button" onClick={() => { setMenuOpen(false); startNewResume(); }}>
              New Resume
            </button>
            <button type="button" onClick={() => selectModeOption("job")}>Resume for Job</button>
            <button type="button" onClick={() => selectModeOption("education")}>Resume for Education</button>
            <button type="button" onClick={() => selectModeOption("internship")}>Resume for Internship</button>
            <button type="button" onClick={() => selectModeOption("general")}>General Resume</button>
          </div>
        )}
      </div>

      {message && (
        <div className={`message-notification message-${message.type}`}>
          {message.text}
        </div>
      )}

      {currentPage === "builder" ? (
        <div className="app-content">
          <div className="form-section">
            <div className="builder-actions">
              <button type="button" className="builder-btn" onClick={startNewResume}>
                + New Resume
              </button>
              <button type="button" className="builder-btn" onClick={() => setCurrentPage("saved")}>
                Saved Resumes ({resumes.length})
              </button>
            </div>
            {activeTemplate && (
              <div className="template-context-badge" aria-live="polite">
                Using Template: <strong>{activeTemplate.name}</strong>
              </div>
            )}
            <ResumeForm key={formVersion} setData={saveResume} resumeMode={resumeMode} />
          </div>
          <div className="preview-section">
            <ResumePreview data={data} template={activeTemplate} />
          </div>
        </div>
      ) : (
        <div className="saved-page">
          <div className="saved-header">
            <h3>Saved Resumes</h3>
            <button type="button" className="builder-btn" onClick={() => setCurrentPage("builder")}>
              Back to Create
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
                    <div className="saved-item-actions">
                      <button type="button" className="builder-btn" onClick={() => openSavedResume(resume)}>
                        Open
                      </button>
                      <button type="button" className="builder-btn" onClick={() => openResumeInNewTab(resume)}>
                        Open Page
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
          <div className="saved-preview-wrap">
            <ResumePreview data={data} template={activeTemplate} />
          </div>
        </div>
      )}

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