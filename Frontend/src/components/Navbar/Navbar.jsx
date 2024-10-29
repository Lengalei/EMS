import React from "react";
import "./Navbar.scss";

const Navbar = () => (
  <header className="navbar">
    <div>{/* <h1>EMPLOYEE MS</h1> */}</div>
    <div className="navbar__welcome">Welcome, Admin</div>
    <button className="navbar__logout">Logout</button>
  </header>
);

export default Navbar;
