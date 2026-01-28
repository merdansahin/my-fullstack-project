import User from "../db/models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    console.log("Register request body:", req.body);
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide a valid email" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || "your_jwt_secret",
      {
        expiresIn: "7d",
      },
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
      token,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "Email already in use" });
    }
  }

  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((val) => val.message);
    return res
      .status(400)
      .json({ success: false, message: messages.join(", ") });
  }

  res.status(500).json({
    success: false,
    message: "Server error during registration",
    error: error.message,
  });
};
exports.test = (req, res) => {
  res.json({ success: true, message: "Auth controller is working!" });
};
