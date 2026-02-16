import express from "express";
import auth from "../middlewares/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  createBooking,
  getUserBookings,
} from "../controllers/bookingController.js";

const router = express.Router();

// Yeni rezervasyon oluştur
router.post("/", auth, ctrlWrapper(createBooking));

// Kullanıcının rezervasyonlarını getir
router.get("/", auth, ctrlWrapper(getUserBookings));

export default router;
