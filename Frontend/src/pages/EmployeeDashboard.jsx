import EmpSidebar from '../components/EmployeeDashboard/EmpSidebar';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';

function EmployeeDashboard() {
  return (
    <div className="admindashboard">
      <EmpSidebar />

      <div className="admin">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}

export default EmployeeDashboard;
