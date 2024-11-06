import express from "express";

import {
  getAllEmployees,
  createEmployee,
} from "../controllers/Employee.controller.js";

const router = express.Router();

router.get("/employees", getAllEmployees);
router.post("/postEmployee", createEmployee);

export default router;
