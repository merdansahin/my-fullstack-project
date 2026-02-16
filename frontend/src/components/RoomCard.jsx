import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Link } from "react-router-dom";
import defaultImage from "../assets/defaultBcg2.jpg";
import "../styles/roomCard.css";

function RoomCard({ room }) {
  // Safely get the image data (from backend 'images' array or old 'imageUrl' field)
  const rawImage =
    room.images?.[0]?.url || room.images?.[0] || room.imageUrl || "";
  const imageUrl =
    rawImage && typeof rawImage === "string" && rawImage.includes("/upload/")
      ? rawImage.replace("/upload/", "/upload/q_auto,f_auto,w_400/")
      : rawImage || defaultImage;

  return (
    <div className="room-card">
      <LazyLoadImage
        src={imageUrl}
        alt={room.name}
        className="room-image"
        effect="blur" // 🔑 Blur effect while image is loading
        width="100%"
        height="200px"
        onError={(e) => {
          if (e.target.src !== defaultImage) {
            e.target.src = defaultImage;
            e.target.onerror = null;
          }
        }}
      />
      <div className="room-info">
        <h3>{room.name}</h3>
        <p>{room.type}</p>
        <p>{room.description}</p>
        <p>
          <strong>${room.price}</strong> / night
        </p>
        <Link to={`/rooms/${room._id}`}>
          <button>Book Now</button>
        </Link>
      </div>
    </div>
  );
}

export default RoomCard;
