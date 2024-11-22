// SalaryTable.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SalaryForm.scss";

const SalaryTable = () => {
  const [salaries, setSalaries] = useState([]);

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const response = await axios.get("http://localhost:6500/api/salaries");
        setSalaries(response.data);
      } catch (error) {
        console.error("Error fetching salaries:", error);
      }
    };

    fetchSalaries();
  }, []);

  return (
    <div className="salarytable">
      <h2>Salary Records</h2>
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
    </div>
  );
};

export default SalaryTable;
