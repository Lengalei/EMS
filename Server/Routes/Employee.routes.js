import express from "express";

import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByDepartment,
  getEmployeeById,
  PostLeaveRequests,
  GetleaveRequests,
  UpdateLeaveRequestStatus,
  deleteLeaveRequest,
  getEmployeeLeaveRequests,
  generalData,
} from "../controllers/Employee.controller.js";
import { authorizeRoles } from "../authmiddleware/authorizeRoles.js";

const router = express.Router();

router.get("/employees", getAllEmployees);
router.get("/employees/:id", getEmployeeById);
router.post("/postEmployee", createEmployee);
router.put("/updateEmployee/:id", updateEmployee); // Update route
router.delete("/deleteEmployee/:id", deleteEmployee); // Delete route
router.get("/department/:departmentId", getEmployeesByDepartment);

//leave functionality
router.post("/leaveRequests/:id", PostLeaveRequests);
router.get("/getleaveRequests", GetleaveRequests);
router.get("/getEmployeeLeaveRequests/:employeeId", getEmployeeLeaveRequests);
router.patch(
  "/leaveRequests/:requestId/status",
  authorizeRoles("Admin"),
  UpdateLeaveRequestStatus
);
router.delete(
  "/deleteLeaveRequest/:id",
  authorizeRoles("Admin"),
  deleteLeaveRequest
);

// general dashboard data
router.get("/generalData", generalData);

export default router;
