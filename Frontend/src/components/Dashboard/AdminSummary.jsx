import React from "react";
import "./AdminSummary.scss";
import { FaUsers } from "react-icons/fa";
import SummaryCard from "./SummaryCard";

const AdminSummary = () => (
  <div className="dashboard">
    <h1>Dashboard Overview</h1>
    <div className="dashboard__metrics">
      <SummaryCard icon={<FaUsers />} text="Number of Employees" number={30} />
      <SummaryCard
        icon={<FaUsers />}
        text="Number of Departments"
        number={10}
        className="secondCard"
      />
      <SummaryCard
        icon={<FaUsers />}
        text="Total Monthly Salaries"
        number={1780000}
      />
    </div>
    <h2>Leave Details</h2>
    <div className="dashboard__leaves">
      <SummaryCard icon={<FaUsers />} text="Leaves Applied" number={1780000} />
      <SummaryCard icon={<FaUsers />} text="Leaves Approved" number={1780000} />
      <SummaryCard icon={<FaUsers />} text="Leaves Rejected" number={1780000} />
    </div>
  </div>
);

export default AdminSummary;
