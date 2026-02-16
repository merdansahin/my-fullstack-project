import Booking from "../db/models/booking.js";
import Room from "../db/models/room.js";

export const createBookingService = async ({
  userId,
  roomId,
  startDate,
  endDate,
}) => {
  // Find the room
  const room = await Room.findById(roomId);
  if (!room) {
    throw new Error("Room not found");
  }

  // Price check
  if (room.price === undefined || room.price === null || isNaN(room.price)) {
    throw new Error(
      "The selected room has missing or invalid price information.",
    );
  }

  // Date and Price Calculation
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid date format.");
  }

  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const days = diffDays === 0 ? 1 : diffDays; // At least 1 day
  const totalPrice = days * room.price;

  if (isNaN(totalPrice)) {
    throw new Error("Total price could not be calculated.");
  }

  // Record
  const booking = await Booking.create({
    user: userId,
    room: roomId,
    checkInDate: startDate,
    checkOutDate: endDate,
    totalPrice: totalPrice,
  });

  return booking;
};

export const getUserBookingsService = async (userId, role) => {
  const query = role === "admin" ? {} : { user: userId };
  return await Booking.find(query)
    .populate("room")
    .populate("user", "name email");
};
