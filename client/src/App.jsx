import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ResumeForm from "./Resume";
import ResumePreview from "./ResumePreview";
import axios from "axios";
import { useTemplateStore } from "./store/templateStore";
import { templates } from "./data/templates";

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "/api" : "http://localhost:5000/api");

function App() {
  const navigate = useNavigate();
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

  const actionBtnClass =
    "inline-flex items-center justify-center rounded-xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500";

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

  const updatePageView = (view) => {
    setCurrentPage(view);
    const params = new URLSearchParams(location.search);
    params.set("view", view);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const startNewResume = () => {
    setData({});
    setFormVersion((v) => v + 1);
    updatePageView("builder");
    window.scrollTo({ top: 0, behavior: "smooth" });
    showMessage("New resume form is ready", "info", 2200);
  };

  const openSavedResume = (resume) => {
    setData(resume || {});
    updatePageView("builder");
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
    const appUrl = `${window.location.origin}/editor?view=builder`;
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
  const fetchResumes = useCallback(async () => {
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
  }, []);

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
      updatePageView("saved");
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
  }, [fetchResumes]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const view = params.get("view");
    if (view === "saved" || view === "builder") {
      setCurrentPage(view);
    }
  }, [location.search]);

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
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 px-3 py-4 text-slate-900 sm:px-4 lg:px-6 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-5 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:px-6">
          <div className="relative flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                Professional Resume Builder
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Create and download your perfect resume in minutes
              </p>
            </div>

            <div className="relative shrink-0">
              <button
                type="button"
                className="rounded-xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Open resume options menu"
                aria-expanded={menuOpen}
              >
                ⋮ Menu
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full z-30 mt-2 w-56 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  <button
                    type="button"
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => {
                      updatePageView("saved");
                      setMenuOpen(false);
                    }}
                  >
                    Saved Resumes
                  </button>
                  <button
                    type="button"
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => {
                      setMenuOpen(false);
                      startNewResume();
                    }}
                  >
                    New Resume
                  </button>
                  <button
                    type="button"
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => selectModeOption("job")}
                  >
                    Resume for Job
                  </button>
                  <button
                    type="button"
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => selectModeOption("education")}
                  >
                    Resume for Education
                  </button>
                  <button
                    type="button"
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => selectModeOption("internship")}
                  >
                    Resume for Internship
                  </button>
                  <button
                    type="button"
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => selectModeOption("general")}
                  >
                    General Resume
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {message && (
          <div
            className={`mb-4 rounded-xl px-4 py-3 text-sm font-medium shadow-sm ${
              message.type === "success"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                : message.type === "error"
                  ? "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200"
                  : "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {currentPage === "builder" ? (
          <div className="grid grid-cols-1 gap-6 overflow-hidden lg:grid-cols-2">
            <section className="min-w-0 w-full max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
              <div className="mb-3 flex flex-wrap gap-2">
                <button type="button" className={actionBtnClass} onClick={startNewResume}>
                  + New Resume
                </button>
                <button type="button" className={actionBtnClass} onClick={() => updatePageView("saved")}>
                  Saved Resumes ({resumes.length})
                </button>
              </div>

              {activeTemplate && (
                <div
                  className="mb-3 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-800 dark:border-sky-800 dark:bg-sky-900/30 dark:text-sky-100"
                  aria-live="polite"
                >
                  Using Template: <strong>{activeTemplate.name}</strong>
                </div>
              )}

              <ResumeForm key={formVersion} setData={saveResume} resumeMode={resumeMode} />
            </section>

            <section className="min-w-0 w-full max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
              <div className="max-h-[80vh] overflow-auto pr-1">
                <ResumePreview data={data} template={activeTemplate} />
              </div>
            </section>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 overflow-hidden lg:grid-cols-[360px_minmax(0,1fr)]">
            <section className="min-w-0 w-full max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h3 className="text-base font-bold">Saved Resumes</h3>
                <button type="button" className={actionBtnClass} onClick={() => updatePageView("builder")}>
                  Back to Create
                </button>
              </div>

              {resumes.length === 0 ? (
                <p className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  No saved resumes yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {resumes
                    .slice()
                    .reverse()
                    .map((resume, index) => (
                      <div
                        className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                        key={resume.id || `${resume.name}-${index}`}
                      >
                        <div className="min-w-0">
                          <strong className="block truncate text-sm text-slate-900 dark:text-slate-100">
                            {resume.name || "Untitled"}
                          </strong>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {resume.email || "No email"}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className={actionBtnClass}
                            onClick={() => openSavedResume(resume)}
                          >
                            Open
                          </button>
                          <button
                            type="button"
                            className={actionBtnClass}
                            onClick={() => openResumeInNewTab(resume)}
                          >
                            Open Page
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </section>

            <section className="min-w-0 w-full max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="max-h-[80vh] overflow-auto pr-1">
                <ResumePreview data={data} template={activeTemplate} />
              </div>
            </section>
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-lg dark:bg-slate-900 dark:text-slate-100">
              Processing...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;