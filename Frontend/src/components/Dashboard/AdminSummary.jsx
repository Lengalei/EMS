import React, { useEffect, useState } from "react";
import "./AdminSummary.scss";
import { FaUsers } from "react-icons/fa";
import SummaryCard from "./SummaryCard";
import apiRequest from "../../lib/apiRequest";

const AdminSummary = () => {
  const [employee, setEmployee] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [totalBasicSalary, setTotalBasicSalary] = useState(0);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await apiRequest.get("/employee/generalData");
        if (response.status) {
          const employeesData = response.data.employees;
          const departmentsData = response.data.departments;
          const salaryData = response.data.salaries;

          setEmployee(employeesData);
          setDepartments(departmentsData);

          // Calculate total basic salary for all employees
          const totalSalary = salaryData.reduce(
            (total, emp) => total + (emp.basicSalary || 0),
            0
          );

          setTotalBasicSalary(totalSalary);
        }
      } catch (error) {
        console.log(error.response?.data?.message || "Error fetching data");
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="dashboard">
      <h1>Dashboard Overview</h1>
      <div className="dashboard__metrics">
        <SummaryCard
          icon={<FaUsers />}
          text="Number of Employees"
          number={employee ? employee.length : 0}
        />
        <SummaryCard
          icon={<FaUsers />}
          text="Number of Departments"
          number={departments ? departments.length : 0}
          className="secondCard"
        />
        <SummaryCard
          icon={<FaUsers />}
          text="Total Basic Salary (Monthly)"
          number={`Ksh. ${totalBasicSalary.toLocaleString()}`}
        />
      </div>
      <h2>Leave Details</h2>
      <div className="dashboard__leaves">
        <SummaryCard icon={<FaUsers />} text="Leaves Applied" number={4} />
        <SummaryCard icon={<FaUsers />} text="Leaves Approved" number={3} />
        <SummaryCard icon={<FaUsers />} text="Leaves Rejected" number={1} />
      </div>
    </div>
  );
};

export default AdminSummary;
