import { useState } from "react";
import "./Resume.css";

export default function ResumeForm({ setData }) {

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    experience: "",
    education: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.email) {
      setData(form);
    } else {
      alert("Please fill in name and email");
    }
  };

  return (
    <form className="resume-form" onSubmit={handleSubmit}>
      <h2>Resume Information</h2>
      <input 
        name="name" 
        placeholder="Full Name" 
        onChange={handleChange}
        required
      />
      <input 
        name="email" 
        placeholder="Email" 
        type="email"
        onChange={handleChange}
        required
      />
      <input 
        name="phone" 
        placeholder="Phone Number" 
        onChange={handleChange}
      />
      <textarea 
        name="skills" 
        placeholder="Skills (comma separated)" 
        onChange={handleChange}
      />
      <textarea 
        name="experience" 
        placeholder="Work Experience" 
        onChange={handleChange}
      />
      <textarea 
        name="education" 
        placeholder="Education" 
        onChange={handleChange}
      />
      
      <button type="submit">Generate Resume</button>
    </form>
  );
}