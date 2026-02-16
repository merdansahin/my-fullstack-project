import Booking from "../db/models/booking.js";
import Room from "../db/models/room.js";

export const createBookingService = async ({
  userId,
  roomId,
  startDate,
  endDate,
}) => {
  // Odayı bul
  const room = await Room.findById(roomId);
  if (!room) {
    throw new Error("Room not found");
  }

  // Fiyat kontrolü
  if (room.price === undefined || room.price === null || isNaN(room.price)) {
    throw new Error("Seçilen odanın fiyat bilgisi eksik veya geçersiz.");
  }

  // Tarih ve Fiyat Hesaplama
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Geçersiz tarih formatı.");
  }

  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const days = diffDays === 0 ? 1 : diffDays; // En az 1 gün
  const totalPrice = days * room.price;

  if (isNaN(totalPrice)) {
    throw new Error("Toplam fiyat hesaplanamadı.");
  }

  // Kayıt
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
