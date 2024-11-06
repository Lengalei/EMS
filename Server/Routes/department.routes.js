import express from "express";
import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  updateDepartment,
} from "../controllers/deparment.controller.js";

const router = express.Router();

router.get("/getAllDepartments", getAllDepartments);
router.post("/createDepartment", createDepartment);
router.delete("/deleteDepartment/:id", deleteDepartment);
router.put("/updateDepartment/:id", updateDepartment);

export default router;
