import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  department: String,
  email: String,
  password: String,
});

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
