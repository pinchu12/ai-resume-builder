import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./ResumePreview.css";

export default function ResumePreview({ data }) {
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

      <div id="resume" className="resume">
        <style id="resume-style">
          {`.resume { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }`}
        </style>

        <div className="resume-banner">
          <span className="resume-icon">🧾</span>
          <h1 className="resume-title">Resume</h1>
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

        <div className="resume-summary">
          <h3>Professional Summary</h3>
          <p>{data.summary || "Detailed-oriented professional with strong technical and communication skills, eager to contribute to team success through hard work and organizational skills."}</p>
        </div>

        <div className="resume-section">
          <h3>Key Skills</h3>
          <ul>
            {data.skills ? data.skills.split(",").map((skill, index) => (
              <li key={index}>{skill.trim()}</li>
            )) : <li>N/A</li>}
          </ul>
        </div>

        <div className="resume-section">
          <h3>Experience</h3>
          <p>{data.experience || "N/A"}</p>
        </div>

        <div className="resume-section">
          <h3>Education</h3>
          <p>{data.education || "N/A"}</p>
        </div>
      </div>
    </div>
  );
}
