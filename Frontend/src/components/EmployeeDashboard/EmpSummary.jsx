import React from "react";
import { useAuth } from "../../context/authContext";

function EmpSummary({}) {
  const { user } = useAuth();
  return (
    <div className="mainCard">
      <div className="dashicon"></div>

      <div className="dashCardContent">
        <p>Welcome Back</p>
        <p>{user.name}</p>
      </div>
    </div>
  );
}

export default EmpSummary;
