import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import Modal from "react-modal";
import "./Employee.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import LeaveRequestsPopup from "./LeaveRequest/LeaveRequestsPopup";
import { InfinitySpin } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import default toast styles
import jsPDF from "jspdf"; // Import jsPDF for PDF generation
import "jspdf-autotable"; // Import autotable for table support in jsPDF

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
      toast.success("Employees fetched successfully!", {
        className: "custom-toast",
      });
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error(
        error.response?.data?.message || "Error fetching employees!",
        {
          className: "custom-toast",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadEmployees = () => {
    try {
      const doc = new jsPDF();
      doc.text("Employee List", 20, 10);

      // Define table columns and rows
      const columns = ["S No", "Name", "DOB", "Department", "Email"];
      const rows = employees.map((emp, index) => [
        index + 1,
        emp.name,
        new Date(emp.dob).toLocaleDateString(),
        emp.department,
        emp.email,
      ]);

      // Add table to PDF
      doc.autoTable({
        head: [columns],
        body: rows,
        startY: 20,
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [40, 167, 69] }, // Green header
      });

      // Save the PDF
      const pdfBlob = doc.output("blob");
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "employees_list.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Open the PDF in a new tab for viewing
      window.open(url, "_blank");

      toast.success("Employee list downloaded as PDF!", {
        className: "custom-toast",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error downloading employee list!", {
        className: "custom-toast",
      });
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

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      toast.success("Employee added successfully!", {
        className: "custom-toast",
      });
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error(error.response?.data?.message || "Error adding employee!", {
        className: "custom-toast",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setNewEmployee(employee);
    setIsModalOpen(true);
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
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
        email: "",
        password: "",
      });
      setIsModalOpen(false);
      await fetchEmployees();
      toast.success("Employee updated successfully!", {
        className: "custom-toast",
      });
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error(error.response?.data?.message || "Error updating employee!", {
        className: "custom-toast",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (id) => {
    setLoading(true);
    try {
      await apiRequest.delete(`/employee/deleteEmployee/${id}`);
      await fetchEmployees();
      toast.success("Employee deleted successfully!", {
        className: "custom-toast",
      });
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error(error.response?.data?.message || "Error deleting employee!", {
        className: "custom-toast",
      });
    } finally {
      setLoading(false);
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
        toast.success("Leave details fetched successfully!", {
          className: "custom-toast",
        });
      }
    } catch (error) {
      console.error("Error fetching leave details:", error);
      toast.error(
        error.response?.data?.message || "Error fetching leave details!",
        {
          className: "custom-toast",
        }
      );
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
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
