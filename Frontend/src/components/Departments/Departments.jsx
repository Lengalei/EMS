import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "./Departments.scss";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const departmentsPerPage = 5;

  // Fetch departments from backend
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/api/getAllDepartments"
      );
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add new department
  const handleAddDepartment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/createDepartment",
        newDepartment
      );
      setDepartments([...departments, response.data]);
      togglePopup();
      setNewDepartment({ name: "", description: "" });
    } catch (error) {
      console.error("Error adding department:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete department
  const handleDeleteDepartment = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:3000/api/deleteDepartment/${id}`);
      setDepartments(departments.filter((dept) => dept._id !== id));
    } catch (error) {
      console.error("Error deleting department:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
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
        <button className="add-department-btn" onClick={togglePopup}>
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
                  <button className="edit-btn">Edit</button>
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
          activeClassName={"active"}
        />
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Add New Department</h3>
            <form onSubmit={handleAddDepartment}>
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
                Add Department
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
