import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function AdminBookingManagement() {
  const { token, user } = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/bookings`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setBookings(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (token) fetchBookings();
  }, [token]);

  const handleApprove = async (id) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/bookings/${id}`,
        { status: "approved" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setBookings(bookings.map((b) => (b._id === id ? res.data : b)));
    } catch (error) {
      alert("Error approving booking");
    }
  };

  const handleCancel = async (id) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/bookings/${id}`,
        { status: "cancelled" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setBookings(bookings.map((b) => (b._id === id ? res.data : b)));
    } catch (error) {
      alert("Error cancelling booking");
    }
  };

  if (!user || user.role !== "admin") {
    return <p>Access denied. Admins only.</p>;
  }

  return (
    <div className="admin-booking">
      <h2>Booking Management</h2>
      <ul>
        {bookings.map((booking) => (
          <li key={booking._id} className="booking-item">
            <p>
              <strong>User:</strong> {booking.userId?.name || booking.userId}
            </p>
            <p>
              <strong>Room:</strong> {booking.roomId?.name || booking.roomId}
            </p>
            <p>
              <strong>Status:</strong> {booking.status}
            </p>
            <button onClick={() => handleApprove(booking._id)}>Approve</button>
            <button onClick={() => handleCancel(booking._id)}>Cancel</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminBookingManagement;
