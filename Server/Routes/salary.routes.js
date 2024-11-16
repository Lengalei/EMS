// routes/salaryRoutes.js
import express from "express";
import {
  createSalary,
  getAllSalaries,
  getSalaryById,
  updateSalary,
  deleteSalary,
} from "../controllers/salary.controller.js";

const router = express.Router();

// CRUD routes for salary
router.post("/add", createSalary);
router.get("/", getAllSalaries);
router.get("/:id", getSalaryById);
router.put("/:id", updateSalary);
router.delete("/:id", deleteSalary);

export default router;
