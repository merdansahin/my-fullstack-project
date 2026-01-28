import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/userSlice";
import "../styles/profile.css";

function Profile() {
  const { token } = useSelector((state) => state.user);
  const [profile, setProfile] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setProfile(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/users/logout`, {
        refreshToken,
      });
    } catch (error) {
      console.error(error);
    }
    dispatch(logout());
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="profile-page">
      <h2>User Profile</h2>
      <p>
        <strong>Name:</strong> {profile.name}
      </p>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Profile;
