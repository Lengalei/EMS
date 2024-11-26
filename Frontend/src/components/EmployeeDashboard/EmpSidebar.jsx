import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCog,
} from "react-icons/fa";
import "../sidebar/Sidebar.scss";
import { useAuth } from "../../context/authContext";

const EmpSidebar = () => {
  const { user } = useAuth();
  console.log(user);
  return (
    <aside className="sidebar">
      <h2 className="sidebar__logo">Employee MS</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/employee-dashboard" activeClassName="active" end>
              <FaTachometerAlt className="sidebar__icon" />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/employee-dashboard/employee-profile/${user._id}`}
              activeClassName="active"
            >
              <FaUser className="sidebar__icon" />
              My profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/employee-dashboard/leaveRequest"
              activeClassName="active"
            >
              <FaCalendarAlt className="sidebar__icon" />
              Leaves
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/employee-dashboard/salaries/${user._id}`}
              activeClassName="active"
            >
              <FaMoneyBillWave className="sidebar__icon" />
              Salary
            </NavLink>
          </li>
          <li>
            <NavLink to="/employee-dashboard/settings" activeClassName="active">
              <FaCog className="sidebar__icon" />
              Settings
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default EmpSidebar;
