import express from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  deleteBooking,
} from "../controllers/bookingController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// Korunan endpointler
router.post("/", auth, createBooking);
router.get("/", auth, getBookings);
router.get("/:id", auth, getBookingById);
router.delete("/:id", auth, deleteBooking);

export default router;
