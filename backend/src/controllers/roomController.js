import createError from "http-errors";
import Room from "../db/models/room.js";
import {
  getAllRoomsService,
  getRoomByIdService,
  createRoomService,
  updateRoomService,
  deleteRoomService,
} from "../services/room.js";

// Get all rooms (with pagination)
export const getRooms = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100; // Default limit is high for the admin panel
  const skip = (page - 1) * limit;

  const rooms = await getAllRoomsService().skip(skip).limit(limit);
  const total = await Room.countDocuments();

  res.json({
    rooms,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
};

// Get a single room by ID
export const getRoomById = async (req, res) => {
  const { id } = req.params;
  const room = await getRoomByIdService(id);
  if (!room) {
    throw createError(404, "Room not found");
  }
  res.json(room);
};

// Create a new room
export const createRoom = async (req, res) => {
  console.log("=== ADD ROOM REQUEST ===");
  console.log("Body:", req.body);
  console.log("File:", req.file);

  const { name, type, price, description, amenities } = req.body;

  if (!name || !price) {
    throw createError(400, "Name and price are required");
  }

  // Convert amenities string from frontend to array
  let parsedAmenities = [];
  if (amenities) {
    parsedAmenities = Array.isArray(amenities)
      ? amenities
      : amenities.split(",").map((item) => item.trim());
  }

  const roomData = {
    name,
    type,
    price,
    description,
    amenities: parsedAmenities,
  };

  // If an image was uploaded, add its path
  if (req.file) {
    console.log("Cloudinary Upload Successful:", req.file.path || req.file.url);
    roomData.images = [
      {
        public_id: req.file.filename || req.file.public_id,
        url: req.file.path || req.file.url || req.file.secure_url,
      },
    ];
  }

  const newRoom = await createRoomService(roomData);
  res.status(201).json(newRoom);
};

// Update room
export const updateRoom = async (req, res) => {
  console.log("=== UPDATE ROOM REQUEST ===");
  console.log("Body:", req.body);
  console.log("File:", req.file);

  const { id } = req.params;
  const { name, type, price, description, amenities } = req.body;

  const updateData = {};
  if (name) updateData.name = name;
  if (type) updateData.type = type;
  if (price) updateData.price = price;
  if (description) updateData.description = description;

  if (amenities !== undefined) {
    updateData.amenities = Array.isArray(amenities)
      ? amenities
      : amenities.split(",").map((item) => item.trim());
  }

  if (req.file) {
    console.log(
      "Cloudinary Upload Successful (Update):",
      req.file.path || req.file.url,
    );
    updateData.images = [
      {
        public_id: req.file.filename || req.file.public_id,
        url: req.file.path || req.file.url || req.file.secure_url,
      },
    ];
  }

  const room = await updateRoomService(id, updateData);
  if (!room) {
    throw createError(404, "Room not found");
  }
  res.json(room);
};

// Delete room
export const deleteRoom = async (req, res) => {
  const { id } = req.params;
  const room = await deleteRoomService(id);
  if (!room) {
    throw createError(404, "Room not found");
  }
  res.json({ message: "Room deleted successfully" });
};
