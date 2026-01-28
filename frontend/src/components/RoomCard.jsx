import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

function RoomCard({ room }) {
  return (
    <div className="room-card">
      <LazyLoadImage
        src={room.imageUrl.replace("/upload/", "/upload/q_auto,f_auto,w_400/")}
        alt={room.name}
        className="room-image"
        effect="blur" // 🔑 Resim yüklenirken blur efekti
        width="100%"
        height="200px"
      />
      <div className="room-info">
        <h3>{room.name}</h3>
        <p>{room.type}</p>
        <p>{room.description}</p>
        <p>
          <strong>${room.price}</strong> / night
        </p>
        <button>Book Now</button>
      </div>
    </div>
  );
}

export default RoomCard;
