// models/Salary.model.js
import mongoose from "mongoose";

const SalarySchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  basicSalary: { type: Number, required: true },
  allowances: { type: Number },
  deductions: { type: Number },
  payDate: { type: Date, required: true },
});

const Salary = mongoose.model("Salary", SalarySchema);

export default Salary;