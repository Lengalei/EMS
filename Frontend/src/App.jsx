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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" />} />
        <Route path="/login" element={<Login />} />
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
          <Route path="/admin-dashboard/salary" element={<SalaryForm />} />
          <Route
            path="/admin-dashboard/employee-profile/:id"
            element={<EmployeeProfile />}
          />
          <Route
            path="/admin-dashboard/salary-table"
            element={<SalaryTable />}
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
        />
      </Routes>
    </Router>
  );
}

export default App;
