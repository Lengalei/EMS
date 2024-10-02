import User from "./models/userModel.js";
import bcrypt from "bcrypt";
import connectToDatabase from "./db/db.js";

const userRegister = async (req, res) => {
  connectToDatabase();
  try {
    const hashedPassword = await bcrypt.hash("Admin", 10);
    const newUser = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "Admin",
    });

    await newUser.save();
  } catch (error) {
    res.status(500).json({ message: "internal server error", error });
  }
};

userRegister();
