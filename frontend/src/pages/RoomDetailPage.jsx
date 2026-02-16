import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../styles/roomDetailPage.css";
import BookingForm from "../components/BookingForm"; // Assuming you have a BookingForm

const RoomDetailPage = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/rooms/${id}`,
        );
        setRoom(res.data);
      } catch (err) {
        setError("Failed to fetch room details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <Link to="/rooms">Back to Rooms</Link>
      </div>
    );
  }

  if (!room) {
    return null; // Or some other placeholder
  }

  const { name, description, price, images, capacity, size, amenities } = room;

  // Helper to get URL string whether image is object or string
  const getImgUrl = (img) => (img?.url ? img.url : img);

  return (
    <div className="room-detail-page">
      <section
        className="room-hero"
        style={{
          backgroundImage: `url(${getImgUrl(images?.[0]) || ""})`,
        }}
        onClick={() => setSelectedImage(getImgUrl(images?.[0]))}
      >
        <h1>{name}</h1>
      </section>

      <section className="room-content">
        <div className="room-images">
          {images?.slice(1).map((img, index) => (
            <img
              key={index}
              onClick={() => setSelectedImage(getImgUrl(img))}
              src={getImgUrl(img)}
              alt={`${name} view ${index + 1}`}
            />
          ))}
        </div>

        <div className="room-details-and-booking">
          <div className="room-info">
            <h2>Details</h2>
            <p>{description}</p>
            <p>
              <strong>Price:</strong> ${price} / night
            </p>
            <p>
              <strong>Capacity:</strong> {capacity} people
            </p>
            <p>
              <strong>Size:</strong> {size} SQFT
            </p>
            {amenities && amenities.length > 0 && (
              <>
                <h3>Amenities</h3>
                <ul className="amenities-list">
                  {amenities.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="booking-section">
            <h2>Book This Room</h2>
            <BookingForm roomId={id} price={price} />
          </div>
        </div>
      </section>

      {/* Full Screen Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <span className="close-modal">&times;</span>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Full Screen View" />
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetailPage;
