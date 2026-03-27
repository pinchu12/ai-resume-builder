import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./ResumePreview.css";

export default function ResumePreview({ data }) {

  const downloadPDF = async () => {
    const element = document.getElementById("resume");
    if (!element) return;

    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF();
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${data.name || "resume"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  if (!data.name) {
    return <div className="resume-preview empty">Fill in the form to see your resume</div>;
  }

  return (
    <div className="resume-preview-container">
      <div id="resume" className="resume">
        <div className="resume-header">
          <h2>{data.name}</h2>
          <div className="resume-contact">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span> | {data.phone}</span>}
          </div>
        </div>

        {data.skills && (
          <div className="resume-section">
            <h3>Skills</h3>
            <p>{data.skills}</p>
          </div>
        )}

        {data.experience && (
          <div className="resume-section">
            <h3>Experience</h3>
            <p>{data.experience}</p>
          </div>
        )}

        {data.education && (
          <div className="resume-section">
            <h3>Education</h3>
            <p>{data.education}</p>
          </div>
        )}
      </div>

      <button onClick={downloadPDF} className="download-btn">
        📥 Download PDF
      </button>
    </div>
  );
}