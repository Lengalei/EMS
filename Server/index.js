import express from "express";
import cors from "cors";
import authRouter from "./Routes/auth.js";
import departmentRouter from "./Routes/department.routes.js";
import employeeRouter from "./Routes/Employee.routes.js";
import connectToDatabase from "./db/db.js";
const app = express();

connectToDatabase();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api", departmentRouter);
app.use("/api", employeeRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server listening at port ${process.env.PORT}`);
});
