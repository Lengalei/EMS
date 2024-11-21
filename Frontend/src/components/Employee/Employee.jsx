import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Modal from "react-modal";
import "./Employee.scss";
import { Link, useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    dob: "",
    department: "",
    email: "",
    password: "",
  });
  const employeesPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:6500/api/employee/employees"
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSalaryRedirect = (employeeId) => {
    navigate(`/admin-dashboard/salaries/${employeeId}`);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      (employee.name &&
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (employee.department &&
        employee.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const displayedEmployees = filteredEmployees.slice(
    currentPage * employeesPerPage,
    (currentPage + 1) * employeesPerPage
  );

  return (
    <div className="employee-page">
      <header className="employee-header">
        <h2>Manage Employees</h2>
        <button
          className="add-employee-btn"
          onClick={() => {
            setIsModalOpen(true);
            setEditingEmployee(null);
            setNewEmployee({
              name: "",
              dob: "",
              department: "",
              email: "",
              password: "",
            });
          }}
        >
          Add New Employee
        </button>
      </header>

      <input
        type="text"
        className="search-input"
        placeholder="Search By Employee Name or Department"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {loading && <div className="loader">Loading...</div>}

      <table className="employee-table">
        <thead>
          <tr>
            <th>S No</th>
            <th>Name</th>
            <th>DOB</th>
            <th>Department</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {displayedEmployees.map((employee, index) => (
            <tr key={employee._id}>
              <td>{currentPage * employeesPerPage + index + 1}</td>
              <td>{employee.name}</td>
              <td>{new Date(employee.dob).toLocaleDateString()}</td>
              <td>{employee.department}</td>
              <td>
                <Link to={`/admin-dashboard/employee-profile/${employee._id}`}>
                  <button className="view-btn">View</button>
                </Link>
                <button
                  className="edit-btn"
                  onClick={() => handleEditEmployee(employee)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteEmployee(employee._id)}
                >
                  Delete
                </button>
                <button
                  className="salary-btn"
                  onClick={() => handleSalaryRedirect(employee._id)}
                >
                  Salary
                </button>
                <button className="leave-btn">Leave</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={Math.ceil(filteredEmployees.length / employeesPerPage)}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  );
};

export default Employee;
