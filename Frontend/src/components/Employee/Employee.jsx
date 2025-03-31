import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import Modal from "react-modal";
import "./Employee.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import LeaveRequestsPopup from "./LeaveRequest/LeaveRequestsPopup";
import { InfinitySpin } from "react-loader-spinner";

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
      const response = await apiRequest.get("/employee/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadEmployees = () => {
    const csvContent = [
      "S No,Name,DOB,Department,Email",
      ...employees.map(
        (emp, index) =>
          `${index + 1},${emp.name},${new Date(emp.dob).toLocaleDateString()},${
            emp.department
          },${emp.email}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "employees_list.csv";
    link.click();
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

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await apiRequest.post("/employee/postEmployee", newEmployee);
      setNewEmployee({
        name: "",
        dob: "",
        department: "",
        email: "",
        password: "",
      });
      setIsModalOpen(false);
      await fetchEmployees();
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
      await apiRequest.put(
        `/employee/updateEmployee/${editingEmployee._id}`,
        newEmployee
      );
      setEditingEmployee(null);
      setNewEmployee({
        name: "",
        dob: "",
        department: "",
      });
      setIsModalOpen(false);
      await fetchEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await apiRequest.delete(`/employee/deleteEmployee/${id}`);
      await fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const [displayLeaveDetails, setDisplayLeaveDetails] = useState(false);
  const [employeeLeaveDetails, setEmployeeLeaveDetails] = useState([]);

  const handleDisplayLeave = async (employee) => {
    await handleFetchLeaveDetails(employee._id);
    setDisplayLeaveDetails(true);
  };

  const handleFetchLeaveDetails = async (id) => {
    setLoading(true);
    try {
      const response = await apiRequest.get(
        `/employee/getEmployeeLeaveRequests/${id}`
      );
      if (response.status) {
        setEmployeeLeaveDetails(response.data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
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
      <div className="table-controls">
        <button className="download-btn" onClick={handleDownloadEmployees}>
          Download Employee List
        </button>
        <input
          type="text"
          className="search-input"
          placeholder="Search By Employee Name or Department"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
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
                <button
                  className="leave-btn"
                  onClick={() => handleDisplayLeave(employee)}
                >
                  Leave
                </button>
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
      {displayLeaveDetails && (
        <div className="EmployeeLeaveDataPopop">
          <LeaveRequestsPopup
            isOpen={displayLeaveDetails}
            onClose={() => setDisplayLeaveDetails(false)}
            leaveRequests={employeeLeaveDetails}
          />
        </div>
      )}
      {loading && (
        <div className="loader-overlay">
          <InfinitySpin
            height="200"
            width="200"
            color="#4fa94d"
            ariaLabel="loading"
            visible={true}
          />
        </div>
      )}
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
          {editingEmployee ? (
            ""
          ) : (
            <>
              <label>Password</label>
              <input
                type="password"
                value={newEmployee.password}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, password: e.target.value })
                }
                required
              />
            </>
          )}

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
