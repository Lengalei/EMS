import React, { useState } from "react";
import "./Departments.scss";

const Departments = () => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="departments-page">
      <header className="departments-header">
        <h2>Manage Departments</h2>
        <button className="add-department-btn" onClick={togglePopup}>
          Add New Department
        </button>
      </header>

      <div className="departments-table">
        <input
          type="text"
          className="search-input"
          placeholder="Search By Department"
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
            <tr>
              <td>1</td>
              <td>IT</td>
              <td>
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Add New Department</h3>
            <form>
              <label>Department Name</label>
              <input type="text" placeholder="Department Name" />
              <label>Description</label>
              <textarea placeholder="Description"></textarea>
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
