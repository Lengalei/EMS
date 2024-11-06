import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
});

const Department = mongoose.model("department", departmentSchema);

export default Department;
