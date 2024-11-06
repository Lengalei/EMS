import mongoose from "mongoose";
import Department from "../models/DepartmentModel.js";

// creating a department
const createDepartment = async (req, res) => {
  const { name, description } = req.body;
  try {
    // validation
    if (!name || !description) {
      return res.status(404).json({ message: "Fill in the required details" });
    }
    const response = await Department.create({ name, description });
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: "Server error" || error.message });
  }
};

// get all the departments

const getAllDepartments = async (req, res) => {
  try {
    const allDepartments = await Department.find({});

    res.status(200).json(allDepartments);
  } catch (error) {
    res.status(500).json({ message: "Server error" || error.message });
  }
};

// updating a department

const updateDepartment = async (req, res) => {
  const { name, description } = req.body;
  const { id } = req.params;

  try {
    // validation
    if (!name || !description) {
      return res.status(404).json({ message: "Fill in the required details" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Invalid User!" });
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    res.status(200).json(updatedDepartment);
  } catch (error) {
    res.status(500).json({ message: "Server error" || error.message });
  }
};

// delete a department
const deleteDepartment = async (req, res) => {
  const { name, description } = req.body;
  const { id } = req.params;

  try {
    // validation
    if (!name || !description) {
      return res.status(404).json({ message: "Fill in the required details" });
    }

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(404).json({ message: "Invalid User!" });
    // }

    const deletedDepartment = await Department.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "Department deleted successfully", deletedDepartment });
  } catch (error) {
    res.status(500).json({ message: "Server error" || error.message });
  }
};

export {
  createDepartment,
  updateDepartment,
  getAllDepartments,
  deleteDepartment,
};
