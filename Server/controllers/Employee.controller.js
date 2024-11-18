import mongoose from "mongoose";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Get all employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "Employee" });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// getting a single employee by id
const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const fetchedEmployee = await User.findById(id);

    res.status(200).json(fetchedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// getting employee by Department
export const getEmployeesByDepartment = async (req, res) => {
  try {
    const employees = await User.find({
      department: req.params.departmentId,
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new employee
const createEmployee = async (req, res) => {
  const { name, dob, department, email, password } = req.body; // Removed 'image'
  try {
    // hashed password
    const hashedPass = await bcrypt.hash(password, 10);
    const employee = new User({
      name,
      dob,
      department,
      email,
      password: hashedPass,
      role: "Employee",
    });
    await employee.save();
    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an employee by ID
const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, dob, department, email } = req.body;

  try {
    const employee = await User.findByIdAndUpdate(
      id,
      { name, dob, department, email },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an employee by ID
const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await User.findByIdAndDelete(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
};
