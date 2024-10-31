import React from "react";
import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";

function RoleBaseRoutes({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!requiredRole.includes(user.role)) {
    <Navigate to="/unauthorised" />;
  }

  return user ? children : <Navigate to="/login" />;
}

export default RoleBaseRoutes;