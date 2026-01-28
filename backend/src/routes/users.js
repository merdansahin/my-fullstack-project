import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/userController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// Yeni kullanıcı kaydı
router.post("/register", registerUser);

// Kullanıcı giriş
router.post("/login", loginUser);

// Kullanıcı profil bilgisi (JWT zorunlu)
router.get("/profile", auth, getUserProfile);

export default router;
