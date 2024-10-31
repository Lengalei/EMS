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
// import { Layout, RequireAuth } from "./Routes/RequireAuth";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/" element={<Layout />} /> */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["admin"]}>
                <AdminDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        />

        {/* <Route element={<RequireAuth />}> */}
        <Route path="/" element={<Navigate to="/admin-dashboard" />} />

        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        {/* </Route> */}
      </Routes>
    </Router>
  );
}

export default App;
