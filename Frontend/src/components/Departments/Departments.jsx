import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import "./Departments.scss";
import axios from "axios";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editDepartmentId, setEditDepartmentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const departmentsPerPage = 5;

  // Fetch departments from backend
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:6500/api/department/getAllDepartments"
      );
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Open the popup and populate the form with department data for editing
  const handleEditClick = (department) => {
    setNewDepartment({
      name: department.name,
      description: department.description,
    });
    setEditDepartmentId(department._id);
    setIsEditing(true);
    setShowPopup(true);
  };

  // Add or update department
  const handleSaveDepartment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing && editDepartmentId) {
        // Update department
        const response = await axios.put(
          `http://localhost:6500/api/department/updateDepartment/${editDepartmentId}`,
          newDepartment
        );
        if (response.status === 200) {
          setDepartments(
            departments.map((dept) =>
              dept._id === editDepartmentId ? response.data : dept
            )
          );
        }
      } else {
        // Add new department
        const response = await axios.post(
          "http://localhost:6500/api/department/createDepartment",
          newDepartment
        );
        setDepartments([...departments, response.data]);
      }
      togglePopup();
      setNewDepartment({ name: "", description: "" });
      setIsEditing(false);
      setEditDepartmentId(null);
    } catch (error) {
      console.error("Error saving department:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete department
  const handleDeleteDepartment = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `http://localhost:6500/api/department/deleteDepartment/${id}`
      );
      if (response.status === 200) {
        setDepartments(departments.filter((dept) => dept._id !== id));
      }
    } catch (error) {
      console.error("Error deleting department:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
    setNewDepartment({ name: "", description: "" });
    setIsEditing(false);
    setEditDepartmentId(null);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Filter and paginate departments
  const filteredDepartments = departments
    .filter(
      (dept) =>
        dept.name && dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(
      currentPage * departmentsPerPage,
      (currentPage + 1) * departmentsPerPage
    );

  const pageCount = Math.ceil(
    departments.filter(
      (dept) =>
        dept.name && dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).length / departmentsPerPage
  );

  return (
    <div className="departments-page">
      <header className="departments-header">
        <h2>Manage Departments</h2>
        <button
          className="add-department-btn"
          onClick={() => setShowPopup(true)}
        >
          Add New Department
        </button>
      </header>

      {loading && <div className="loader">Loading...</div>}

      <div className="departments-table">
        <input
          type="text"
          className="search-input"
          placeholder="Search By Department"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <table>
          <thead>
            <tr>
              <th>S No</th>
              <th>Department</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.map((dept, index) => (
              <tr key={dept._id}>
                <td>{currentPage * departmentsPerPage + index + 1}</td>
                <td>{dept.name}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEditClick(dept)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteDepartment(dept._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
        />
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>{isEditing ? "Edit Department" : "Add New Department"}</h3>
            <form onSubmit={handleSaveDepartment}>
              <label>Department Name</label>
              <input
                type="text"
                value={newDepartment.name}
                onChange={(e) =>
                  setNewDepartment({ ...newDepartment, name: e.target.value })
                }
                placeholder="Department Name"
                required
              />
              <label>Description</label>
              <textarea
                value={newDepartment.description}
                onChange={(e) =>
                  setNewDepartment({
                    ...newDepartment,
                    description: e.target.value,
                  })
                }
                placeholder="Description"
                required
              ></textarea>
              <button type="submit" className="submit-btn">
                {isEditing ? "Update Department" : "Add Department"}
              </button>
              <button type="button" className="close-btn" onClick={togglePopup}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
