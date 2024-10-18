import express from "express";
import cors from "cors";
import authRouter from "./Routes/auth.js";
import connectToDatabase from "./db/db.js";
const app = express();

connectToDatabase();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server listening at port ${process.env.PORT}`);
});
