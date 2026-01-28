import express from "express";
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// Tüm odaları getir
router.get("/", getRooms);

// Tek oda getir
router.get("/:id", getRoomById);

// Yeni oda oluştur (sadece admin)
router.post("/", auth, createRoom);

// Oda güncelle (sadece admin)
router.put("/:id", auth, updateRoom);

// Oda sil (sadece admin)
router.delete("/:id", auth, deleteRoom);

export default router;
