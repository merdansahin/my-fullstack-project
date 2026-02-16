import {
  createBookingService,
  getUserBookingsService,
} from "../services/booking.js";

// Create a new booking
export const createBooking = async (req, res, next) => {
  const { roomId, startDate, endDate } = req.body;

  if (!roomId || !startDate || !endDate) {
    return res.status(400).json({
      message:
        "Missing information: roomId, startDate, and endDate are required.",
    });
  }

  try {
    const booking = await createBookingService({
      userId: req.user.id,
      roomId,
      startDate,
      endDate,
    });
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    if (
      error.message === "Room not found" ||
      error.message.includes("price") ||
      error.message.includes("date")
    ) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

// Get user's bookings
export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await getUserBookingsService(req.user.id, req.user.role);
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};
