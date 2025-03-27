import React from "react";
import { useAuth } from "../../context/authContext";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBuilding,
} from "react-icons/fa";
import "./EmpSummary.scss";

const EmpSummary = () => {
  const { user } = useAuth();

  // Example Data (Replace with actual API data)
  const employeeData = {
    profileImage: "/empprof2.jfif", // Replace with actual image URL
    department: "Software Engineering",
    salaryEarned: "$5,000",
    leaves: {
      approved: 5,
      rejected: 1,
      pending: 2,
    },
    upcomingEvents: [
      { date: "2025-04-10", event: "Team Meeting" },
      { date: "2025-04-15", event: "Project Deadline" },
      { date: "2025-04-22", event: "Company Workshop" },
    ],
  };

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-card">
        <img
          src={employeeData.profileImage}
          alt="Profile"
          className="profile-img"
        />
        <div className="dashCardContent">
          <p>Welcome Back</p>
          <h2>{user.name}</h2>
        </div>
      </div>

      {/* Employee Info Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <FaBuilding className="stat-icon" />
          <h3>{employeeData.department}</h3>
          <p>Department</p>
        </div>

        <div className="stat-card salary">
          <FaMoneyBillWave className="stat-icon" />
          <h3>{employeeData.salaryEarned}</h3>
          <p>Salary Earned</p>
        </div>
      </div>

      {/* Leave Summary */}
      <div className="leave-summary">
        <h3>Leave Status</h3>
        <div className="stats-grid">
          <div className="stat-card approved">
            <FaCheckCircle className="stat-icon" />
            <h3>{employeeData.leaves.approved}</h3>
            <p>Approved Leaves</p>
          </div>

          <div className="stat-card rejected">
            <FaTimesCircle className="stat-icon" />
            <h3>{employeeData.leaves.rejected}</h3>
            <p>Rejected Leaves</p>
          </div>

          <div className="stat-card pending">
            <FaClock className="stat-icon" />
            <h3>{employeeData.leaves.pending}</h3>
            <p>Pending Leaves</p>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="events-section">
        <h3>Upcoming Events</h3>
        <ul>
          {employeeData.upcomingEvents.map((event, index) => (
            <li key={index}>
              <FaCalendarAlt className="event-icon" />
              <span>
                {event.date} - {event.event}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmpSummary;
