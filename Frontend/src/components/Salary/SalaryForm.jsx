// SalaryForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SalaryForm.scss";

const SalaryForm = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [salaryData, setSalaryData] = useState({
    basicSalary: "",
    allowances: "",
    deductions: "",
    payDate: "",
  });

  useEffect(() => {
    // Fetch departments
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:6500/api/salary/departments"
        );
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  // Fetch employees when a department is selected
  useEffect(() => {
    if (selectedDepartment) {
      const fetchEmployees = async () => {
        try {
          const response = await axios.get(
            `http://localhost:6500/api/salary/employees/${selectedDepartment}`
          );
          setEmployees(response.data);
        } catch (error) {
          console.error("Error fetching employees:", error);
        }
      };

      fetchEmployees();
    } else {
      setEmployees([]);
      setSelectedEmployee("");
    }
  }, [selectedDepartment]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSalaryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:6500/api/salary/addSalary", {
        employee: selectedEmployee,
        ...salaryData,
      });
      alert("Salary added successfully");
      setSalaryData({
        basicSalary: "",
        allowances: "",
        deductions: "",
        payDate: "",
      });
      setSelectedDepartment("");
      setSelectedEmployee("");
    } catch (error) {
      console.error("Error adding salary:", error);
      alert("Failed to add salary");
    }
  };

  return (
    <div className="salary-form">
      <h2>Add New Salary</h2>
      <form onSubmit={handleSubmit}>
        <label>Department</label>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          required
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.name}
            </option>
          ))}
        </select>

        <label>Employee</label>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          required
          disabled={!selectedDepartment}
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name}
            </option>
          ))}
        </select>

        <label>Basic Salary</label>
        <input
          type="number"
          name="basicSalary"
          value={salaryData.basicSalary}
          onChange={handleInputChange}
          required
          placeholder="Insert Salary"
        />

        <label>Allowances</label>
        <input
          type="number"
          name="allowances"
          value={salaryData.allowances}
          onChange={handleInputChange}
          placeholder="Monthly Allowances"
        />

        <label>Deductions</label>
        <input
          type="number"
          name="deductions"
          value={salaryData.deductions}
          onChange={handleInputChange}
          placeholder="Monthly Deductions"
        />

        <label>Pay Date</label>
        <input
          type="date"
          name="payDate"
          value={salaryData.payDate}
          onChange={handleInputChange}
          required
        />

        <button type="submit">Add Salary</button>
      </form>
    </div>
  );
};

export default SalaryForm;
