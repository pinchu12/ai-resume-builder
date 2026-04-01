import { useEffect, useState } from "react";
import "./Resume.css";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  skills: "",
  experience: "",
  education: "",
  photo: null,
  photoPreview: null
};

export default function ResumeForm({ setData, resumeMode = "general", onDraftChange }) {
  const [form, setForm] = useState(initialFormState);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!onDraftChange) return;
    onDraftChange({
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      skills: form.skills,
      experience: form.experience,
      education: form.education,
      photoPreview: form.photoPreview
    });
  }, [form, onDraftChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, photo: "Image size should be less than 5MB" });
        return;
      }
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, photo: "Please upload a valid image file" });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({
          ...form,
          photo: file,
          photoPreview: reader.result
        });
        setErrors({ ...errors, photo: "" });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (form.email && !form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Invalid email format";
    }
    // Make other fields optional for now
    // if (!form.skills.trim()) newErrors.skills = "Skills are required";
    // if (!form.experience.trim()) newErrors.experience = "Experience is required";
    // if (!form.education.trim()) newErrors.education = "Education is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const resumeData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        skills: form.skills,
        experience: form.experience,
        education: form.education,
        photoPreview: form.photoPreview
      };
      
      await setData(resumeData);
      setForm(initialFormState);
    } catch (error) {
      console.error("Error submitting form:", error);
      try {
        const localResumes = JSON.parse(localStorage.getItem("resumes") || "[]");
        const safeLocalResumes = Array.isArray(localResumes) ? localResumes : [];
        const backupResume = {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          skills: form.skills,
          experience: form.experience,
          education: form.education,
          id: Date.now()
        };
        safeLocalResumes.push(backupResume);
        localStorage.setItem("resumes", JSON.stringify(safeLocalResumes.slice(-25)));
        setErrors({ submit: "Saved locally successfully." });
      } catch {
        setErrors({ submit: "Failed to save resume. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="resume-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>📝 Professional Resume Builder</h2>
        <p>Fill in your details and create your resume</p>
        <p className="mode-badge">Mode: {resumeMode}</p>
      </div>

      <div className="form-section">
        <label className="section-title">📷 Profile Photo</label>
        <div className="photo-upload">
          {form.photoPreview && (
            <div className="photo-preview">
              <img src={form.photoPreview} alt="Profile" />
              <button
                type="button"
                className="btn-remove-photo"
                onClick={() => setForm({ ...form, photo: null, photoPreview: null })}
              >
                Remove Photo
              </button>
            </div>
          )}
          {!form.photoPreview && (
            <div className="photo-input-label">
              <div className="upload-area">
                <div className="upload-icon">📸</div>
                <p>Upload from Camera or Gallery</p>
                <p className="upload-hint">JPG, PNG, GIF (Max 5MB)</p>
              </div>
              <div className="photo-actions">
                <label className="photo-action-btn">
                  Open Camera
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoChange}
                    className="hidden-input"
                  />
                </label>
                <label className="photo-action-btn">
                  Choose from Gallery
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden-input"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
        {errors.photo && <span className="error-text">{errors.photo}</span>}
      </div>

      <div className="form-section">
        <label className="section-title">👤 Personal Information</label>
        <div className="input-group">
          <div className="input-wrapper">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              style={{ color: "#000000", WebkitTextFillColor: "#000000" }}
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>
          <div className="input-wrapper">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              style={{ color: "#000000", WebkitTextFillColor: "#000000" }}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
        </div>
        <div className="input-group">
          <div className="input-wrapper">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              style={{ color: "#000000", WebkitTextFillColor: "#000000" }}
            />
          </div>
          <div className="input-wrapper">
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              style={{ color: "#000000", WebkitTextFillColor: "#000000" }}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <label className="section-title">💼 Professional Details</label>
        <div className="textarea-wrapper">
          <textarea
            name="skills"
            placeholder="Skills (e.g., JavaScript, React, Node.js, Database Design)"
            value={form.skills}
            onChange={handleChange}
            rows="3"
            style={{ color: "#000000", WebkitTextFillColor: "#000000" }}
            className={errors.skills ? "input-error" : ""}
          />
          {errors.skills && <span className="error-text">{errors.skills}</span>}
        </div>
        <div className="textarea-wrapper">
          <textarea
            name="experience"
            placeholder="Work Experience (e.g., Senior Developer at XYZ Company 2020-Present...)"
            value={form.experience}
            onChange={handleChange}
            rows="4"
            style={{ color: "#000000", WebkitTextFillColor: "#000000" }}
            className={errors.experience ? "input-error" : ""}
          />
          {errors.experience && <span className="error-text">{errors.experience}</span>}
        </div>
        <div className="textarea-wrapper">
          <textarea
            name="education"
            placeholder="Education (e.g., Bachelor's in Computer Science...)"
            value={form.education}
            onChange={handleChange}
            rows="3"
            style={{ color: "#000000", WebkitTextFillColor: "#000000" }}
            className={errors.education ? "input-error" : ""}
          />
          {errors.education && <span className="error-text">{errors.education}</span>}
        </div>
      </div>

      {errors.submit && <div className="error-message">{errors.submit}</div>}

      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? "⏳ Generating Resume..." : "✨ Generate Resume"}
      </button>
    </form>
  );
}