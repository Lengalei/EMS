import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Modal from "react-modal";
import "./Employee.scss";
import { Link } from "react-router-dom";

Modal.setAppElement("#root"); // Set root element for accessibility

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

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:6500/api/employee/postEmployee",
        newEmployee
      );
      setNewEmployee({
        name: "",
        dob: "",
        department: "",
        email: "",
        password: "",
      });
      setIsModalOpen(false);
      await fetchEmployees(); // Refresh the list after adding
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setNewEmployee(employee);
    setIsModalOpen(true);
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:6500/api/employees/updateEmployee/${editingEmployee._id}`,
        newEmployee
      );
      setEditingEmployee(null);
      setNewEmployee({
        name: "",
        dob: "",
        department: "",
      });
      setIsModalOpen(false);
      await fetchEmployees(); // Refresh the list after updating
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await axios.delete(
        `http://localhost:6500/api/employee/deleteEmployee/${id}`
      );
      await fetchEmployees(); // Refresh the list after deleting
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

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
        placeholder="Search By Employee ID"
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
                  {" "}
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
                <button className="salary-btn">Salary</button>
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

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h3>{editingEmployee ? "Edit Employee" : "Add New Employee"}</h3>
        <form
          onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
          className="modal-form"
        >
          <label>Name</label>
          <input
            type="text"
            value={newEmployee.name}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, name: e.target.value })
            }
            required
          />
          <label>DOB</label>
          <input
            type="date"
            value={newEmployee.dob}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, dob: e.target.value })
            }
            required
          />
          <label>Department</label>
          <input
            type="text"
            value={newEmployee.department}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, department: e.target.value })
            }
            required
          />
          <label>Email</label>
          <input
            type="email"
            value={newEmployee.email}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, email: e.target.value })
            }
            required
          />
          <label>Password</label>
          <input
            type="text"
            value={newEmployee.password}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, password: e.target.value })
            }
            required
          />
          <button type="submit">
            {editingEmployee ? "Update Employee" : "Add Employee"}
          </button>
          <button type="button" onClick={() => setIsModalOpen(false)}>
            Close
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Employee;
