import React from "react";
import "../styles/hero.css";
import bgImg from "../assets/defaultBcg2.jpg";

function Home() {
  return (
    <header className="hero" style={{ backgroundImage: `url(${bgImg})` }}>
      <div className="hero-overlay">
        <h1>Welcome to HotelBooking</h1>
        <p>Book your stay easily and quickly.</p>
      </div>
    </header>
  );
}

export default Home;
