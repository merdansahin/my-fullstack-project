import express from "express";
import jwt from "jsonwebtoken";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/userController.js";
import User from "../db/models/user.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getUserProfile);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    // Token oluşturma
    const generateAccessToken = (user) => {
      return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" },
      );
    };

    const generateRefreshToken = (user) => {
      return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
      });
    };

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});
// Refresh tokenları DB veya memory'de tutabilirsin
//let refreshTokens = [];

router.post("/logout", (req, res) => {
  const { refreshToken } = req.body;
  // Refresh token listeden silinir
  //refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.status(200).json({ success: true, message: "Logged out successfully" });
});
router.get("/profile", getUserProfile);
//router.put("/profile", updateUserProfile);

export default router;
