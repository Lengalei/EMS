import React, { useContext } from "react";
import { userContext } from "../context/authContext";
// import { useAuth } from '../context/authContext'

function AdminDashboard() {
  const { user } = useContext(userContext);
  return <div>AdminDashboard {user.name}</div>;
}

export default AdminDashboard;
