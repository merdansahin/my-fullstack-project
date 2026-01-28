import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/userSlice";
import "../styles/register.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/users/register`,
        formData,
      );
      alert("Registration successful!");
      // Opsiyonel: otomatik login
      const loginRes = await axios.post(
        `${process.env.REACT_APP_API_URL}/users/login`,
        {
          email: formData.email,
          password: formData.password,
        },
      );
      dispatch(
        loginSuccess({ user: loginRes.data.user, token: loginRes.data.token }),
      );
      localStorage.setItem("token", loginRes.data.token);
    } catch (error) {
      alert("Error registering user");
    }
  };

  return (
    <div className="register-page">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            className="input"
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            className="input"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className="input"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="button" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
