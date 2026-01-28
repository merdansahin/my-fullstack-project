import Room from "../db/models/room.js";

// Tüm odaları getir
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Tek oda getir
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Yeni oda oluştur
export const createRoom = async (req, res) => {
  try {
    const { name, type, price, description, amenities, images } = req.body;

    const room = new Room({
      name,
      type,
      price,
      description,
      amenities,
      images,
    });

    await room.save();
    res.status(201).json({ message: "Room created successfully", room });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Oda güncelle
export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json({ message: "Room updated successfully", room });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Oda sil
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
