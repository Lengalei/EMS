import React from "react";
import "./Navbar.scss";
import { useAuth } from "../../context/authContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <header className="navbar">
      <div>{/* <h1>EMPLOYEE MS</h1> */}</div>
      <div className="navbar__welcome">Welcome {user.name}</div>
      <button className="navbar__logout" onClick={logout}>
        Logout
      </button>
    </header>
  );
};

export default Navbar;
