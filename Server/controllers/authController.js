import User from '../models/userModel.js';
import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    // validating the email
    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await bycrypt.compare(password, user.password);

    if (!isValid) {
      return res
        .status(404)
        .json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: '10d' }
    );

    res
      .status(200)
      .cookie('token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 10,
        httpOnly: true, // Make it inaccessible to JavaScript
        // secure: true, // Only send cookie over HTTPS
        // sameSite: 'None', // Required for cross-site cookies
      })
      .json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          role: user.role,
        },
      });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

const register = async (req, res) => {
  const { userName: name, email, password } = req.body;
  try {
    //check if that email is already in use
    const exists = await User.findOne({ email: email });
    if (exists) {
      return res.status(404).json({ message: 'Email Already Exists!' });
    }
    //hash password
    const hashPass = await bycrypt.hash(password, 10);

    //create user
    const user = await User.create({
      name,
      email,
      password: hashPass,
      role: 'Admin',
    });
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

const verify = (req, res) => {
  return res.status(200).json({ success: true, user: req.user });
};

export { login, verify, register };
