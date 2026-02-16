import React from "react";

function BookingCard({ booking }) {
  return (
    <div className="booking-card">
      <h3>{booking.roomId?.name || booking.roomId}</h3>
      <p>
        <strong>Check-In:</strong>{" "}
        {new Date(booking.checkIn || booking.checkInDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Check-Out:</strong>{" "}
        {new Date(
          booking.checkOut || booking.checkOutDate,
        ).toLocaleDateString()}
      </p>
      <p>
        <strong>Status:</strong> {booking.status || "Pending"}
      </p>
    </div>
  );
}

export default BookingCard;
