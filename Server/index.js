import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./Routes/auth.js";
import departmentRouter from "./Routes/department.routes.js";
import employeeRouter from "./Routes/Employee.routes.js";
import salaryRoutes from "./Routes/salary.routes.js";
import connectToDatabase from "./db/db.js";
const app = express();

dotenv.config();
connectToDatabase();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/department", departmentRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/salaries", salaryRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server listening at port ${process.env.PORT}`);
});
