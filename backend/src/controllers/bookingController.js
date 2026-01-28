import Booking from "../../models/Booking.js";
import Room from "../../models/Rooms.js";

// Yeni rezervasyon oluştur
export const createBooking = async (req, res) => {
  try {
    const { userId, roomId, checkIn, checkOut } = req.body;

    // Oda mevcut mu kontrol et
    const room = await Room.findById(roomId);
    if (!room || !room.available) {
      return res.status(400).json({ message: "Room not available" });
    }

    const booking = new Booking({
      user: userId,
      room: roomId,
      checkIn,
      checkOut,
    });

    await booking.save();

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Tüm rezervasyonları getir
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("room").populate("user");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Tek rezervasyonu getir
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("room")
      .populate("user");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Rezervasyonu sil
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
