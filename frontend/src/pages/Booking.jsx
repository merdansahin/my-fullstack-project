import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import "../styles/booking.css";

function Booking() {
  const { roomId } = useParams(); // Get roomId from URL parameters (if it exists)
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(roomId || "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Fetch rooms (for the dropdown list)
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/rooms?limit=100`,
        );
        // Get rooms based on API response structure (Pagination support or plain array)
        const fetchedRooms =
          res.data.rooms || (Array.isArray(res.data) ? res.data : []);

        setRooms(fetchedRooms);
      } catch (err) {
        // Odalar yüklenirken hata oluştu (Sessizce geçiliyor)
      }
    };
    fetchRooms();
  }, []);

  // If roomId comes from the URL, update the state
  useEffect(() => {
    if (roomId) {
      setSelectedRoom(roomId);
    }
  }, [roomId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Get the token first from Redux, if not, from localStorage
    const currentToken = token || localStorage.getItem("token");

    if (!currentToken) {
      alert("Please log in to make a reservation.");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/bookings`,
        {
          roomId: selectedRoom,
          startDate,
          endDate,
        },
        {
          headers: { Authorization: `Bearer ${currentToken}` },
        },
      );
      setSuccess(true);
      setTimeout(() => {
        navigate("/profile"); // Redirect to profile/history page after successful operation
      }, 2000);
    } catch (err) {
      // If the token has expired (401), alert the user and redirect to login
      if (err.response && err.response.status === 401) {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("token"); // Clear the old token
        navigate("/login");
        return;
      }
      setError(
        err.response?.data?.message ||
          "An error occurred while creating the booking.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">
      <h1>Make a Reservation</h1>
      {success && (
        <p style={{ color: "green" }}>
          Booking created successfully! Redirecting...
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form className="booking-form" onSubmit={handleSubmit}>
        <label>
          Select Room:
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            required
          >
            <option value="">-- Select a Room --</option>
            {rooms.map((room) => {
              const hasPrice =
                room.price !== undefined &&
                room.price !== null &&
                !isNaN(room.price);
              return (
                <option key={room._id} value={room._id} disabled={!hasPrice}>
                  {room.name || "Unnamed Room"} ({room.type || "Standard"}) -{" "}
                  {hasPrice
                    ? `$${room.price}`
                    : "No Price Info (Cannot be selected)"}
                </option>
              );
            })}
          </select>
        </label>

        <label>
          Check-in Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>

        <label>
          Check-out Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Complete Reservation"}
        </button>
      </form>
    </div>
  );
}

export default Booking;
