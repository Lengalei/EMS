import User from "../models/userModel.js";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email: email });

    // validating the email
    if (!foundUser) {
      throw new error("User not found");
    }

    const isValid = await bycrypt.compare(password, foundUser.password);

    if (!isValid) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { _id: foundUser._id, role: foundUser.role },
      process.env.JWT_KEY,
      { expiresIn: "10d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: foundUser._id,
        name: foundUser.name,
        role: foundUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export { login };
