import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/userSlice";
import "../styles/global.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const userState = useSelector((state) => state.user);
  const user = userState?.userInfo || userState?.user;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Debug: Kullanıcı durumunu konsolda gör

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h1 style={{ color: "white" }}>HotelBooking</h1>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/rooms">Rooms</Link>
            <Link to="/booking">Booking</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/profile">Profile</Link>
            <Link className="link" to="/booking-history">
              My Bookings
            </Link>
            {user.role?.toLowerCase() === "admin" && (
              <Link className="link" to="/admin">
                Admin Panel
              </Link>
            )}
            <span className="user-name">{user.name || "User"}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
