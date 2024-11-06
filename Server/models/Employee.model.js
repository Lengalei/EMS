import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  department: String,
  image: String,
});

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
