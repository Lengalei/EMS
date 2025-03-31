import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";

const EmpSalaryTable = ({ employeeDetails, salaries }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000); // Simulate loading state
  }, []);

  const handleDownloadSalary = (employee, salaries) => {
    if (!employee || salaries.length === 0) {
      alert("No data available to download.");
      return;
    }

    const doc = new jsPDF();

    // Load the company logo
    const img = new Image();
    img.src = "/houselogo1.png"; // Ensure this path is correct

    img.onload = function () {
      // Add the logo
      doc.addImage(img, "PNG", 10, 10, 50, 20);

      // Company Details
      doc.setFontSize(14);
      doc.text("Company Name", 70, 20);
      doc.setFontSize(10);
      doc.text("Company Address", 70, 30);
      doc.text("Email: contact@example.com", 70, 35);
      doc.text("Phone: (+254) 123-456-789", 70, 40);

      // Employee Salary Report Title
      doc.setFontSize(16);
      doc.setFont("times", "bold");
      doc.text("Employee Salary Report", 10, 60);

      // Employee Details
      doc.setFont("times", "normal");
      doc.text(`Employee: ${employee.name}`, 10, 70);
      doc.text(`Email: ${employee.email}`, 10, 80);
      doc.text(`Department: ${employee.department || "N/A"}`, 10, 90);

      // Salary Table Header
      let y = 100;
      doc.setFont("times", "bold");
      doc.text("Pay Date", 10, y);
      doc.text("Basic Salary", 50, y);
      doc.text("Allowances", 90, y);
      doc.text("Deductions", 130, y);
      doc.text("Total Pay", 170, y);

      // Salary Table Content
      doc.setFont("times", "normal");
      salaries.forEach((salary, index) => {
        y += 10;
        doc.text(new Date(salary.payDate).toLocaleDateString(), 10, y);
        doc.text(salary.basicSalary.toFixed(2), 50, y);
        doc.text(salary.allowances.toFixed(2), 90, y);
        doc.text(salary.deductions.toFixed(2), 130, y);
        doc.text(
          (salary.basicSalary + salary.allowances - salary.deductions).toFixed(
            2
          ),
          170,
          y
        );
      });

      // Save the PDF
      doc.save(`Salary_Report_${employee.name}.pdf`);
    };
  };

  return (
    <div className="salary-table-page">
      <h2>Employee Salary Table</h2>

      {loading ? (
        <div className="loading">Loading salary details...</div>
      ) : (
        <>
          <table className="salary-table">
            <thead>
              <tr>
                <th>Pay Date</th>
                <th>Basic Salary</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Total Pay</th>
              </tr>
            </thead>
            <tbody>
              {salaries.map((salary, index) => (
                <tr key={index}>
                  <td>{new Date(salary.payDate).toLocaleDateString()}</td>
                  <td>{salary.basicSalary.toFixed(2)}</td>
                  <td>{salary.allowances.toFixed(2)}</td>
                  <td>{salary.deductions.toFixed(2)}</td>
                  <td>
                    {(
                      salary.basicSalary +
                      salary.allowances -
                      salary.deductions
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className="download-salary-btn"
            onClick={() => handleDownloadSalary(employeeDetails, salaries)}
          >
            Download PDF
          </button>
        </>
      )}
    </div>
  );
};

export default EmpSalaryTable;
