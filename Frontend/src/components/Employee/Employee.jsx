import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Modal from "react-modal";
import "./Employee.scss";
import "../../lib/apiRequest";

Modal.setAppElement("#root"); // Set root element for accessibility

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    dob: "",
    department: "",
    image: null,
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
    const formData = new FormData();
    formData.append("name", newEmployee.name);
    formData.append("dob", newEmployee.dob);
    formData.append("department", newEmployee.department);
    formData.append("image", newEmployee.image);

    try {
      await axios.post(
        "http://localhost:6500/api/employee/postEmployee",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setNewEmployee({ name: "", dob: "", department: "", image: null });
      setIsModalOpen(false);
      await fetchEmployees(); // Ensure the list is refreshed after adding an employee
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const handleImageChange = (e) => {
    setNewEmployee({ ...newEmployee, image: e.target.files[0] });
  };

  return (
    <div className="employee-page">
      <header className="employee-header">
        <h2>Manage Employees</h2>
        <button
          className="add-employee-btn"
          onClick={() => setIsModalOpen(true)}
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
            <th>Image</th>
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
              <td>
                <img
                  src={employee.image}
                  alt={employee.name}
                  className="employee-image"
                />
              </td>
              <td>{employee.name}</td>
              <td>{new Date(employee.dob).toLocaleDateString()}</td>{" "}
              {/* Format date */}
              <td>{employee.department}</td>
              <td>
                <button className="view-btn">View</button>
                <button className="edit-btn">Edit</button>
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
        <h3>Add New Employee</h3>
        <form onSubmit={handleAddEmployee} className="modal-form">
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
          <label>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          <button type="submit">Add Employee</button>
          <button type="button" onClick={() => setIsModalOpen(false)}>
            Close
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Employee;
