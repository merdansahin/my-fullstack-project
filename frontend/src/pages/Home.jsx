import React from "react";
import "../styles/hero.css";
import bgImg from "../assets/defaultBcg2.jpg";

function Home() {
  return (
    <header className="hero" style={{ backgroundImage: `url(${bgImg})` }}>
      <h1>Welcome to HotelBooking</h1>
      <p>Book your stay easily and quickly.</p>
    </header>
  );
}

export default Home;
