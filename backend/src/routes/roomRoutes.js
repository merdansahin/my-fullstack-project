import express from "express";
import upload from "../middlewares/upload.js";
import Room from "../models/Room.js";

const router = express.Router();

// Yeni oda ekleme (resim upload ile)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const room = new Room({
      name: req.body.name,
      price: req.body.price,
      imageUrl: req.file.path, // Cloudinary URL
    });
    await room.save();
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tüm odaları listeleme
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;
  const rooms = await Room.find().skip(skip).limit(limit);

  const total = await Room.countDocuments();

  res.json({
    rooms,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
});
export default router;
