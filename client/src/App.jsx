import { useState, useEffect } from "react";
import ResumeForm from "./Resume";
import ResumePreview from "./ResumePreview";
import axios from "axios";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function App() {
  const [data, setData] = useState({});
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Show message notification
  const showMessage = (text, type = "success", duration = 3000) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), duration);
  };

  // Fetch resumes from backend
  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/resumes`);
      if (response.data.success) {
        setResumes(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
      showMessage("Unable to connect to server. Make sure the backend is running.", "error", 5000);
    } finally {
      setLoading(false);
    }
  };

  // Save resume to backend
  const saveResume = async (resumeData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/resumes`, resumeData, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.data.success) {
        setData(resumeData);
        fetchResumes();
        showMessage("✅ Resume created successfully!", "success");
        return response.data.data;
      }
    } catch (error) {
      console.error("Error saving resume:", error);
      const errorMsg = error.response?.data?.error || error.message || "Failed to save resume";
      showMessage(`❌ Error: ${errorMsg}`, "error", 5000);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
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
          <ResumeForm setData={saveResume} />
        </div>
        <div className="preview-section">
          <ResumePreview data={data} />
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