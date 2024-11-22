import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SalaryTable.scss";
import apiRequest from "../../lib/apiRequest";
import { useAuth } from "../../context/authContext";

const EmpSalaryTable = () => {
  const { employeeId } = useParams();
  const [salaries, setSalaries] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSalaries();
    fetchEmployeeDetails();
    fetchDepartments();
  }, []);

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const response = await apiRequest.get(`/salaries/salaries/${employeeId}`);
      setSalaries(response.data);
    } catch (error) {
      console.error("Error fetching salaries:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeDetails = async () => {
    try {
      const response = await apiRequest.get(`/employee/${employeeId}`);
      setEmployeeDetails(response.data);
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await apiRequest.get("/department/getAllDepartments");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const { user } = useAuth();
  return (
    <div className="salary-table-page">
      <h2>
        Salaries for {employeeDetails ? employeeDetails.name : "Employee"}
      </h2>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : salaries.length === 0 ? (
        <p>No salary records found.</p>
      ) : (
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
                    (salary.allowances || 0) -
                    (salary.deductions || 0)
                  ).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        className="add-salary-btn"
        onClick={() => navigate(`/admin-dashboard/add-salary/${employeeId}`)}
      >
        Add Salary
      </button>
    </div>
  );
};

export default EmpSalaryTable;
