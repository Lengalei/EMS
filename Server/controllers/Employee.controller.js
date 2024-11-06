import Employee from "../models/Employee.model.js";

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEmployee = async (req, res) => {
  const { name, dob, department, image } = req.body;
  try {
    const employee = new Employee({ name, dob, department, image });
    await employee.save();
    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { getAllEmployees, createEmployee };
