import express from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { isValidId } from "../middlewares/isValidId.js";
import auth from "../middlewares/auth.js"; // Admin koruması için
import { admin } from "../middlewares/adminMiddleware.js"; // Admin koruması için
import {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  deleteContactMessage,
} from "../controllers/contactController.js";

const router = express.Router();

// Yeni bir iletişim mesajı gönder (Herkese açık)
router.post("/", ctrlWrapper(createContactMessage));

// Tüm iletişim mesajlarını listele (Sadece Admin)
router.get("/", auth, admin, ctrlWrapper(getAllContactMessages));

// Belirli bir iletişim mesajını getir (Sadece Admin)
router.get(
  "/:contactId",
  auth,
  admin,
  isValidId,
  ctrlWrapper(getContactMessageById),
);

// Bir iletişim mesajını sil (Sadece Admin)
router.delete(
  "/:contactId",
  auth,
  admin,
  isValidId,
  ctrlWrapper(deleteContactMessage),
);

export default router;
