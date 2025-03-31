// src/components/EmployeePDFDownload.jsx
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../../public/nlogo.png"; // Adjust the path to your logo file

const EmployeePDFDownload = ({
  employees,
  companyName = "Your Company Name",
}) => {
  const generatePDF = () => {
    try {
      // Validate employees data
      if (!employees || employees.length === 0) {
        throw new Error("No employees available to download.");
      }

      const doc = new jsPDF();

      // Load the logo image
      const logoImg = new Image();
      logoImg.src = logo;

      // Header: Add logo, company name, and date
      const pageWidth = doc.internal.pageSize.getWidth();
      const logoWidth = 30;
      const logoHeight = 30;
      doc.addImage(logoImg, "PNG", 10, 10, logoWidth, logoHeight);

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(companyName, 50, 20);

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const currentDate = new Date().toLocaleDateString();
      doc.text(`Date: ${currentDate}`, 50, 30);

      doc.setFontSize(14);
      doc.text("Employee List", pageWidth / 2, 50, { align: "center" });

      // Define table columns
      const columns = ["S No", "Name", "DOB", "Department", "Email"];

      // Map employees to rows with validation
      const rows = employees.map((emp, index) => {
        const name = emp.name || "N/A";
        const dob = emp.dob ? new Date(emp.dob).toLocaleDateString() : "N/A";
        const department = emp.department || "N/A";
        const email = emp.email || "N/A";
        return [index + 1, name, dob, department, email];
      });

      // Add table to PDF
      doc.autoTable({
        head: [columns],
        body: rows,
        startY: 60,
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 3,
          textColor: [40, 40, 40],
        },
        headStyles: {
          fillColor: [40, 167, 69], // Green header
          textColor: [255, 255, 255],
          fontSize: 12,
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240], // Light gray for alternate rows
        },
        margin: { top: 60 },
        didDrawPage: (data) => {
          // Footer: Add page number
          const pageCount = doc.internal.getNumberOfPages();
          const pageNumber = data.pageNumber;
          doc.setFontSize(10);
          doc.setTextColor(100);
          doc.text(
            `Page ${pageNumber} of ${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: "center" }
          );
        },
      });

      // Save the PDF
      const pdfBlob = doc.output("blob");
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "employees_list.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Open the PDF in a new tab for viewing
      try {
        window.open(url, "_blank");
      } catch (viewError) {
        console.warn("Failed to open PDF in new tab:", viewError);
      }

      // Clean up the URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error; // Let the parent component handle the error
    }
  };

  return (
    <button className="download-btn" onClick={generatePDF}>
      Download Employee List
    </button>
  );
};

export default EmployeePDFDownload;
