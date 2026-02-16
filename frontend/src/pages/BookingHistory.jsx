import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logout } from "../redux/slices/userSlice";
import BookingCard from "../components/BookingCard";
import "../styles/bookingHistory.css";

function BookingHistory() {
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/bookings`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setBookings(res.data);
      } catch (err) {
        console.error("Booking fetch error:", err);
        setError(err.response?.data?.message || "Error fetching bookings");
        if (err.response?.status === 401) {
          alert("Oturum süreniz doldu. Lütfen tekrar giriş yapın.");
          dispatch(logout());
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMyBookings();
    } else {
      setLoading(false);
    }
  }, [token, dispatch, navigate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!bookings.length) return <p>No bookings found.</p>;

  return (
    <div className="booking-history">
      <h2>My Bookings</h2>
      <div className="booking-list">
        {bookings.map((booking) => (
          <BookingCard
            className="booking-card"
            key={booking._id}
            booking={booking}
          />
        ))}
      </div>
    </div>
  );
}

export default BookingHistory;
