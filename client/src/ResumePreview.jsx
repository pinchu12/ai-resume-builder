import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./ResumePreview.css";

const getTemplateTheme = (template) => {
  if (!template) {
    return {
      "--accent": "#3498db",
      "--soft-accent": "rgba(52, 152, 219, 0.2)",
      "--title": "#2c3e50"
    };
  }

  const map = {
    "ATS Friendly": { "--accent": "#0ea5e9", "--soft-accent": "rgba(14, 165, 233, 0.2)", "--title": "#0f172a" },
    Professional: { "--accent": "#2563eb", "--soft-accent": "rgba(37, 99, 235, 0.2)", "--title": "#1e293b" },
    Creative: { "--accent": "#7c3aed", "--soft-accent": "rgba(124, 58, 237, 0.2)", "--title": "#3b0764" },
    Minimal: { "--accent": "#334155", "--soft-accent": "rgba(51, 65, 85, 0.2)", "--title": "#111827" }
  };

  return map[template.category] || map.Professional;
};

export default function ResumePreview({ data, template }) {
  const sectionOrderMap = {
    "ATS Friendly": ["experience", "skills", "education", "summary"],
    Professional: ["summary", "experience", "skills", "education"],
    Creative: ["summary", "skills", "experience", "education"],
    Minimal: ["summary", "skills", "education", "experience"]
  };

  const sectionOrder = sectionOrderMap[template?.category] || sectionOrderMap.Professional;

  const skillsList = data.skills
    ? data.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
    : [];

  const getSummary = () => {
    if (data.summary?.trim()) return data.summary;

    if (template?.category === "ATS Friendly") {
      return "Results-driven candidate with clear role impact, measurable outcomes, and ATS-optimized achievements.";
    }

    if (template?.category === "Creative") {
      return "Creative professional focused on combining visual thinking, problem solving, and strong execution across projects.";
    }

    if (template?.category === "Minimal") {
      return "Focused professional with a clean and outcome-oriented work style, strong collaboration, and disciplined delivery.";
    }

    return "Detail-oriented professional with strong communication and execution skills, committed to delivering measurable results.";
  };

  const sectionContent = {
    summary: {
      title: "Professional Summary",
      node: <p>{getSummary()}</p>
    },
    skills: {
      title: "Key Skills",
      node: (
        <ul>
          {skillsList.length > 0 ? (
            skillsList.map((skill, index) => <li key={index}>{skill}</li>)
          ) : (
            <li>N/A</li>
          )}
        </ul>
      )
    },
    experience: {
      title: "Experience",
      node: <p>{data.experience || "N/A"}</p>
    },
    education: {
      title: "Education",
      node: <p>{data.education || "N/A"}</p>
    }
  };

  const renderSections = (keys) =>
    keys.map((key) => (
      <div className={key === "summary" ? "resume-summary" : "resume-section"} key={key}>
        <h3>{sectionContent[key].title}</h3>
        {sectionContent[key].node}
      </div>
    ));

  const category = template?.category || "Professional";
  const templateClass =
    category === "ATS Friendly"
      ? "resume--ats"
      : category === "Creative"
        ? "resume--creative"
        : category === "Minimal"
          ? "resume--minimal"
          : "resume--professional";

  const downloadPDF = async () => {
    const element = document.getElementById("resume");
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      let heightLeft = imgHeight - 297;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save(`${data.name ? data.name.replace(/\s+/g, "_") : "resume"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  const printResume = () => {
    const element = document.getElementById("resume");
    if (!element) return;

    const printWindow = window.open("", "", "height=900,width=800");
    if (!printWindow) return;

    printWindow.document.write(`<!DOCTYPE html><html><head><title>Resume</title><style>${document.getElementById("resume-style").innerHTML}</style></head><body>${element.outerHTML}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (!data || !data.name) {
    return (
      <div className="resume-preview empty">
        <div className="empty-state">
          <span className="empty-icon">📄</span>
          <h3>No Resume Data</h3>
          <p>Fill the form and click Generate to view your resume here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-preview-container">
      <div className="preview-controls">
        <button className="btn-download" onClick={downloadPDF} title="Download as PDF">
          📥 Download PDF
        </button>
        <button className="btn-print" onClick={printResume} title="Print Resume">
          🖨️ Print
        </button>
      </div>

      <div id="resume" className={`resume ${templateClass}`} style={getTemplateTheme(template)}>
        <style id="resume-style">
          {`.resume { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }`}
        </style>

        {category === "Creative" ? (
          <>
            <div className="resume-banner">
              <span className="resume-icon">🧾</span>
              <h1 className="resume-title">Creative Resume</h1>
              {template?.name && <span className="resume-template-name">{template.name}</span>}
            </div>
            <div className="resume-meta-badges">
              {template?.category && <span className="meta-chip">{template.category}</span>}
              {template?.atsScore && <span className="meta-chip">ATS {template.atsScore}</span>}
              {template?.premium && <span className="meta-chip premium">Premium</span>}
            </div>
            <div className="resume-creative-grid">
              <aside className="resume-creative-sidebar">
                {data.photoPreview ? (
                  <div className="resume-photo-wrap">
                    <img src={data.photoPreview} alt="Profile" className="resume-photo" />
                  </div>
                ) : (
                  <div className="resume-photo-wrap placeholder">No Photo</div>
                )}
                <h2>{data.name}</h2>
                {data.phone && <p>📞 {data.phone}</p>}
                {data.email && <p>✉️ {data.email}</p>}
                {data.address && <p>📍 {data.address}</p>}
                <div className="resume-section">
                  <h3>Key Skills</h3>
                  {sectionContent.skills.node}
                </div>
              </aside>
              <main className="resume-creative-main">
                <div className="resume-summary">
                  <h3>{sectionContent.summary.title}</h3>
                  {sectionContent.summary.node}
                </div>
                <div className="resume-section">
                  <h3>{sectionContent.experience.title}</h3>
                  {sectionContent.experience.node}
                </div>
                <div className="resume-section">
                  <h3>{sectionContent.education.title}</h3>
                  {sectionContent.education.node}
                </div>
              </main>
            </div>
          </>
        ) : category === "Minimal" ? (
          <>
            <div className="resume-minimal-head">
              <h2>{data.name}</h2>
              <p>{[data.email, data.phone, data.address].filter(Boolean).join(" • ")}</p>
              {template?.name && <span className="resume-template-name">{template.name}</span>}
            </div>
            {renderSections(sectionOrder)}
          </>
        ) : category === "ATS Friendly" ? (
          <>
            <div className="resume-ats-head">
              <h2>{data.name}</h2>
              <p>{data.email || ""} {data.phone ? `| ${data.phone}` : ""}</p>
              {template?.atsScore && <span className="meta-chip">ATS {template.atsScore}</span>}
            </div>
            {renderSections(sectionOrder)}
          </>
        ) : (
          <>
            <div className="resume-banner">
              <span className="resume-icon">🧾</span>
              <h1 className="resume-title">Resume</h1>
              {template?.name && <span className="resume-template-name">{template.name}</span>}
            </div>

            <div className="resume-meta-badges">
              {template?.category && <span className="meta-chip">{template.category}</span>}
              {template?.atsScore && <span className="meta-chip">ATS {template.atsScore}</span>}
              {template?.premium && <span className="meta-chip premium">Premium</span>}
            </div>

            <div className="resume-header">
              <div className="resume-left">
                {data.photoPreview ? (
                  <div className="resume-photo-wrap">
                    <img src={data.photoPreview} alt="Profile" className="resume-photo" />
                  </div>
                ) : (
                  <div className="resume-photo-wrap placeholder">No Photo</div>
                )}
              </div>

              <div className="resume-right">
                <h2>{data.name}</h2>
                {data.phone && <p>📞 {data.phone}</p>}
                {data.email && <p>✉️ {data.email}</p>}
                {data.address && <p>📍 {data.address}</p>}
              </div>
            </div>

            {renderSections(sectionOrder)}
          </>
        )}
      </div>
    </div>
  );
}
