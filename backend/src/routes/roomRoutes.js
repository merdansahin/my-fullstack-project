import express from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import upload from "../middlewares/upload.js";
import auth from "../middlewares/auth.js";
import { admin } from "../middlewares/adminMiddleware.js";
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController.js";

const router = express.Router();

// Tüm odaları listeleme (Sayfalama ile)
router.get("/", ctrlWrapper(getRooms));

// Tek oda getir
router.get("/:id", ctrlWrapper(getRoomById));

// Yeni oda ekleme (Admin/Auth + Resim Upload)
router.post("/", auth, admin, upload.single("image"), ctrlWrapper(createRoom));

// Oda güncelleme
router.put(
  "/:id",
  auth,
  admin,
  upload.single("image"),
  ctrlWrapper(updateRoom),
);

// Oda silme
router.delete("/:id", auth, admin, ctrlWrapper(deleteRoom));

export default router;
