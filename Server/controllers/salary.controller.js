// controllers/salaryController.js
import Salary from "../models/salaryModel.js";
import Employee from "../models/Employee.model.js";

// Create a new salary
export const createSalary = async (req, res) => {
  const { employee, basicSalary, allowances, deductions, payDate } = req.body;
  try {
    const newSalary = new Salary({
      employee,
      basicSalary,
      allowances,
      deductions,
      payDate,
    });
    const savedSalary = await newSalary.save();
    res.status(201).json(savedSalary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all salaries
export const getAllSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find().populate("employee", "name");
    res.json(salaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single salary by ID
export const getSalaryById = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id).populate(
      "employee",
      "name"
    );
    if (!salary) return res.status(404).json({ message: "Salary not found" });
    res.json(salary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update salary by ID
export const updateSalary = async (req, res) => {
  const { basicSalary, allowances, deductions, payDate } = req.body;
  try {
    const updatedSalary = await Salary.findByIdAndUpdate(
      req.params.id,
      { basicSalary, allowances, deductions, payDate },
      { new: true }
    );
    if (!updatedSalary)
      return res.status(404).json({ message: "Salary not found" });
    res.json(updatedSalary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete salary by ID
export const deleteSalary = async (req, res) => {
  try {
    const deletedSalary = await Salary.findByIdAndDelete(req.params.id);
    if (!deletedSalary)
      return res.status(404).json({ message: "Salary not found" });
    res.json({ message: "Salary deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
