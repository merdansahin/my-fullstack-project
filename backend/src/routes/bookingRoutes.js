import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Korunan route
router.post("/", protect, (req, res) => {
  // Burada sadece giriş yapmış kullanıcı rezervasyon yapabilir
  res.json({ message: "Booking created successfully", user: req.user });
});

export default router;
