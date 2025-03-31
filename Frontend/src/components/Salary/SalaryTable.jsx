import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SalaryForm.scss";
import apiRequest from "../../lib/apiRequest";

const SalaryTable = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const response = await apiRequest.get("/salaries/salaries");
        setSalaries(response.data);
      } catch (error) {
        console.error("Error fetching salaries:", error);
      } finally {
        setLoading(false); // Hide loader after data fetch
      }
    };

    fetchSalaries();
  }, []);

  return (
    <div className="salarytable">
      <h2>Salary Records</h2>

      {loading ? ( // Show loader if fetching data
        <div className="loader">Loading salaries...</div>
      ) : salaries.length === 0 ? (
        <p>No salary records found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Basic Salary</th>
              <th>Allowances</th>
              <th>Deductions</th>
              <th>Pay Date</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((salary) => (
              <tr key={salary._id}>
                <td>{salary.employee.name}</td>
                <td>{salary.basicSalary}</td>
                <td>{salary.allowances}</td>
                <td>{salary.deductions}</td>
                <td>{new Date(salary.payDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SalaryTable;
