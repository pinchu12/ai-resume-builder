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
      
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 297;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save(`${data.name || "resume"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  const printResume = () => {
    const element = document.getElementById("resume");
    const printWindow = window.open("", "", "height=800,width=1000");
    printWindow.document.write(element.innerHTML);
    printWindow.document.close();
    printWindow.print();
  };

  if (!data.name) {
    return (
      <div className="resume-preview empty">
        <div className="empty-state">
          <span className="empty-icon">📄</span>
          <h3>No Resume Yet</h3>
          <p>Fill in the form on the left to see your resume preview here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-preview-container">
      <div className="preview-controls">
        <button onClick={downloadPDF} className="btn-download" title="Download as PDF">
          📥 Download PDF
        </button>
        <button onClick={printResume} className="btn-print" title="Print Resume">
          🖨️ Print
        </button>
      </div>

      <div id="resume" className="resume">
        <div className="resume-title-row">
          <div className="resume-title-icon">📄</div>
          <div className="resume-title">Resume</div>
        </div>

        {/* HEADER WITH PHOTO */}
        <div className="resume-header">
          <div className="header-content">
            {data.photoPreview && (
              <div className="resume-photo">
                <img src={data.photoPreview} alt={data.name} />
              </div>
            )}
            <div className="header-text">
              <h1>{data.name}</h1>
              <div className="header-contact">
                {data.phone && <span>📱 {data.phone}</span>}
                {data.email && <span>📧 {data.email}</span>}
                {data.address && <span>📍 {data.address}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="resume-lines">
          {data.skills && (
            <div className="line-item">
              <span className="line-label">Skills:</span>
              <span className="line-value">{data.skills}</span>
            </div>
          )}
          {data.experience && (
            <div className="line-item">
              <span className="line-label">Experience:</span>
              <span className="line-value">{data.experience}</span>
            </div>
          )}
          {data.education && (
            <div className="line-item">
              <span className="line-label">Education:</span>
              <span className="line-value">{data.education}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}