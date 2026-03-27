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

  // Fetch resumes from backend
  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/resumes`);
      setResumes(response.data);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Save resume to backend
  const saveResume = async (resumeData) => {
    try {
      const response = await axios.post(`${API_URL}/resumes`, resumeData);
      setData(resumeData);
      fetchResumes();
      return response.data;
    } catch (error) {
      console.error("Error saving resume:", error);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🎯 Resume Builder</h1>
        <p>Create your professional resume in minutes</p>
      </header>
      <div className="app-content">
        <div className="form-section">
          <ResumeForm setData={saveResume} />
        </div>
        <div className="preview-section">
          <ResumePreview data={data} />
        </div>
      </div>
      {loading && <p className="loading">Loading...</p>}
    </div>
  );
}

export default App;