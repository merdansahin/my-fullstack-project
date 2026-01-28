import React, { useState } from "react";
import axios from "axios";

function BookingForm({ roomId }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // JWT token
      await axios.post(
        `${process.env.REACT_APP_API_URL}/bookings`,
        { roomId, checkIn, checkOut },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Booking successful!");
    } catch (error) {
      alert("Error creating booking");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <label>Check-In Date</label>
      <input
        type="date"
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
        required
      />

      <label>Check-Out Date</label>
      <input
        type="date"
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
        required
      />

      <button type="submit">Confirm Booking</button>
    </form>
  );
}

export default BookingForm;
