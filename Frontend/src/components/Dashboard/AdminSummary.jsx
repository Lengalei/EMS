import React from "react";
import "./AdminSummary.scss";
import { FaUsers } from "react-icons/fa";
import SummaryCard from "./SummaryCard";

const AdminSummary = () => (
  <div className="dashboard">
    <h1>Dashboard Overview</h1>
    <div className="dashboard__metrics">
      <SummaryCard icon={<FaUsers />} text="Number of Employees" number={13} />
    </div>
    <h2>Leave Details</h2>
    <div className="dashboard__leaves">
      <div className="leave">Leave Applied: 2</div>
      <div className="leave">Leave Approved: 2</div>
      <div className="leave">Leave Rejected: 2</div>
    </div>
  </div>
);

export default AdminSummary;
