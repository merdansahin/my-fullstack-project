import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBookings } from "../redux/slices/bookingSlice";
import BookingCard from "../components/BookingCard";
import "../styles/bookingHistory.css";

function BookingHistory() {
  const { bookings, loading, error } = useSelector((state) => state.booking);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!bookings.length) return <p>No bookings found.</p>;

  return (
    <div className="booking-history">
      <h2>My Bookings</h2>
      <div className="booking-list">
        {bookings.map((booking) => (
          <BookingCard key={booking._id} booking={booking} />
        ))}
      </div>

      <ul>
        {bookings.map((booking) => (
          <li key={booking._id} className="booking-item">
            <p>
              <strong>Room:</strong> {booking.roomId?.name || booking.roomId}
            </p>
            <p>
              <strong>Check-In:</strong>{" "}
              {new Date(booking.checkIn).toLocaleDateString()}
            </p>
            <p>
              <strong>Check-Out:</strong>{" "}
              {new Date(booking.checkOut).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookingHistory;
