import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCog,
} from "react-icons/fa";
import "./Sidebar.scss";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2 className="sidebar__logo">Employee MS</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/admin-dashboard" activeClassName="active" end>
              <FaTachometerAlt className="sidebar__icon" />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/employees" activeClassName="active">
              <FaUsers className="sidebar__icon" />
              Employees
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin-dashboard/departments" activeClassName="active">
              <FaBuilding className="sidebar__icon" />
              Departments
            </NavLink>
          </li>
          <li>
            <NavLink to="/leaves" activeClassName="active">
              <FaCalendarAlt className="sidebar__icon" />
              Leaves
            </NavLink>
          </li>
          <li>
            <NavLink to="/salary" activeClassName="active">
              <FaMoneyBillWave className="sidebar__icon" />
              Salary
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" activeClassName="active">
              <FaCog className="sidebar__icon" />
              Settings
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
