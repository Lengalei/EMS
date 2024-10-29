// src/layouts/Layout.jsx

import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import { useAuth } from "../context/authContext";
import "./layout.scss";
import { Navigate, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="authlayout">
      <Navbar />
      {/* <Sidebar /> Uncomment this if Sidebar should be visible on all pages */}
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

function RequireAuth() {
  const { user, loading } = useAuth(); // Access user and loading from the context

  if (loading) {
    return <div>Loading...</div>; // Optionally replace with a loading spinner or component
  }

  if (user) {
    return (
      <div className="layout">
        <Navbar />
        <Sidebar />
        <div className="content">
          <Outlet />
        </div>
      </div>
    );
  } else {
    return <Navigate to="/login" />;
  }
}

export { Layout, RequireAuth };
