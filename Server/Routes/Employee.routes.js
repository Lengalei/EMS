import express from "express";

import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByDepartment,
} from "../controllers/Employee.controller.js";

const router = express.Router();

router.get("/employees", getAllEmployees);
router.post("/postEmployee", createEmployee);
router.put("/updateEmployee/:id", updateEmployee); // Update route
router.delete("/deleteEmployee/:id", deleteEmployee); // Delete route
router.get("/department/:departmentId", getEmployeesByDepartment);

export default router;
