import express from "express";
import auth from "../middlewares/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

import {
  register,
  login,
  logout,
  getProfile,
  refreshAccessToken,
} from "../controllers/authController.js";

const router = express.Router();

// Register
router.post("/register", ctrlWrapper(register));

// Login
router.post("/login", ctrlWrapper(login));

// Logout
router.post("/logout", ctrlWrapper(logout));

// Token Refresh (tokenRoutes.js'ten taşındı)
router.post("/refresh", ctrlWrapper(refreshAccessToken));

// Profile (Protected)
router.get("/profile", auth, ctrlWrapper(getProfile));

export default router;
