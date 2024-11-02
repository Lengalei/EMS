import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  department: {
    type: String,
  },
  description: {
    type: String,
  },
});

const Department = mongoose.model("department", departmentSchema);

export default departmentSchema;
