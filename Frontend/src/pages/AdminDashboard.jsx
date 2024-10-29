import React from "react";
import "./Pages.scss";
import AdminSummary from "../components/Dashboard/AdminSummary";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import { useAuth } from "../context/authContext";
import { Outlet } from "react-router-dom";

function AdminDashboard() {
  const { user } = useAuth();
  return (
    <div className="admindashboard">
      <Sidebar />

      <div className="admin">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}

export default AdminDashboard;
