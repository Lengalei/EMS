import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";
import AdminSummary from "./components/Dashboard/AdminSummary";
import Departments from "./components/Departments/Departments";
import Employee from "./components/Employee/Employee";
import SalaryForm from "./components/Salary/SalaryForm";
import SalaryTable from "./components/Salary/SalaryTable";
import EmployeeProfile from "./components/Employee/EmployeeProfile";
import EmpSummary from "./components/EmployeeDashboard/EmpSummary";
import EmpProfile from "./components/EmployeeDashboard/EmpProfile";
import EmpSalaryTable from "./components/Salary/EmpSalaryTable";
import Register from "./pages/Register";
import LeaveRequestsAdmin from "./components/Employee/LeaveRequest/LeaveRequestsAdmin";
import LeaveRequestForm from "./components/Employee/LeaveRequest/LeaveRequestForm";
import EmpSalaryTable2 from "./components/EmployeeDashboard/EmpSalaryTable2";
import Settings from "./components/settings/settings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["admin"]}>
                <AdminDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<AdminSummary />}></Route>
          <Route
            path="/admin-dashboard/departments"
            element={<Departments />}
          />
          <Route path="/admin-dashboard/employees" element={<Employee />} />
          <Route
            path="/admin-dashboard/employees/LeaveRequestsAdmin"
            element={<LeaveRequestsAdmin />}
          />
          <Route path="/admin-dashboard/salary" element={<SalaryForm />} />
          <Route
            path="/admin-dashboard/employee-profile/:id"
            element={<EmployeeProfile />}
          />
          <Route
            path="/admin-dashboard/salary-table"
            element={<SalaryTable />}
          />
          <Route
            path="/admin-dashboard/salaries/:employeeId"
            element={<EmpSalaryTable2 />}
          />
        </Route>

        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["admin", "employee"]}>
                <EmployeeDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<EmpSummary />}></Route>
          <Route
            path="/employee-dashboard/employee-profile/:id"
            element={<EmpProfile />}
          />
          <Route path="/employee-dashboard/settings" element={<Settings />} />
          <Route
            path="/employee-dashboard/salaries/:employeeId"
            element={<EmpSalaryTable2 />}
          />
          <Route
            path="/employee-dashboard/leaveRequest"
            element={<LeaveRequestForm />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
