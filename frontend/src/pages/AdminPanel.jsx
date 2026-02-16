import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useSelector } from "react-redux";
import "../styles/admin.css";

function AdminPanel() {
  const userState = useSelector((state) => state.user);
  const { token } = userState;
  const user = userState.userInfo || userState.user;
  const [rooms, setRooms] = useState([]);
  const [editRoom, setEditRoom] = useState(null);
  const [image, setImage] = useState(null);

  const [newRoom, setNewRoom] = useState({
    name: "",
    type: "",
    price: "",
    description: "",
    amenities: "",
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axiosInstance.get("/rooms");
        setRooms(res.data.rooms || res.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (token) fetchRooms();
  }, [token]);

  const handleAddRoom = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newRoom.name);
    formData.append("type", newRoom.type);
    formData.append("price", newRoom.price);
    formData.append("description", newRoom.description);
    formData.append("amenities", newRoom.amenities);

    if (image) {
      // Backend expects a single file (upload.single), if it's an array, take the first one
      const file = Array.isArray(image) ? image[0] : image;
      if (file) {
        formData.append("image", file);
      }
    }

    try {
      const res = await axiosInstance.post("/rooms", formData);
      setRooms([...rooms, res.data]);
      setNewRoom({
        name: "",
        type: "",
        price: "",
        description: "",
        amenities: "",
      });
      setImage(null);
      alert("Room added successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "An error occurred while adding the room",
      );
    }
  };

  const handleDeleteRoom = async (id) => {
    try {
      await axiosInstance.delete(`/rooms/${id}`);
      setRooms(rooms.filter((room) => room._id !== id));
      alert("Room deleted");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "An error occurred while deleting the room",
      );
    }
  };
  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", editRoom.name);
    formData.append("type", editRoom.type);
    formData.append("price", editRoom.price);
    formData.append("description", editRoom.description);
    // If amenities is an array, convert to string and send; if it's a string, send directly
    const amenitiesVal = Array.isArray(editRoom.amenities)
      ? editRoom.amenities.join(", ")
      : editRoom.amenities;
    formData.append("amenities", amenitiesVal || "");

    if (image) {
      const file = Array.isArray(image) ? image[0] : image;
      if (file) {
        formData.append("image", file);
      }
    }

    try {
      const res = await axiosInstance.put(`/rooms/${editRoom._id}`, formData);
      setRooms(
        rooms.map((room) => (room._id === editRoom._id ? res.data : room)),
      );
      setEditRoom(null);
      setImage(null);
      alert("Room updated");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "An error occurred while updating the room",
      );
    }
  };

  if (!user || user.role?.toLowerCase() !== "admin") {
    return <p>Access denied. Only administrators can enter.</p>;
  }

  return (
    <div className="admin-panel">
      <h2 className="admin-header">Admin Panel</h2>

      <form onSubmit={handleAddRoom} className="add-room-form">
        <label>Room Name</label>
        <input
          type="text"
          placeholder="Room Name"
          value={newRoom.name}
          onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
          required
        />
        <label>Room Type</label>
        <select
          value={newRoom.type}
          onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
          required
          style={{
            padding: "0.8rem",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <option value="">Select Room Type</option>
          <option value="Single">Single</option>
          <option value="Double Deluxe">Double Deluxe</option>
          <option value="Family Deluxe">Family Deluxe</option>
          <option value="Presidential Deluxe">Presidential Deluxe</option>
        </select>
        <label>Price</label>
        <input
          type="number"
          placeholder="Price"
          value={newRoom.price}
          onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
          required
        />
        <label>Description</label>
        <textarea
          className="textarea"
          placeholder="Description"
          value={newRoom.description}
          onChange={(e) =>
            setNewRoom({ ...newRoom, description: e.target.value })
          }
          required
        />
        <label>Amenities</label>
        <input
          type="text"
          placeholder="Amenities (comma-separated, e.g., Wifi, TV)"
          value={newRoom.amenities}
          onChange={(e) =>
            setNewRoom({ ...newRoom, amenities: e.target.value })
          }
        />
        <label>Room Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(Array.from(e.target.files))}
          multiple
        />
        <button type="submit">Add Room</button>
      </form>

      <h3>Existing Rooms</h3>
      <ul>
        {rooms.map((room) => (
          <li key={room._id}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {room.images && room.images.length > 0 && (
                <img
                  src={room.images[0]?.url || room.images[0]}
                  alt={room.name}
                  className="room-image"
                />
              )}
              <span className="room-image-text">
                <strong>{room.name}</strong> - ${room.price}
              </span>
            </div>
            <div>
              <button
                onClick={() => {
                  setEditRoom(room);
                  setImage(null);
                }}
                className="room-image-button button-first"
              >
                Edit
              </button>
              <button
                className="room-image-button button-last"
                onClick={() => handleDeleteRoom(room._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editRoom && (
        <form onSubmit={handleUpdateRoom} className="edit-room-form">
          <h3>Edit Room</h3>
          <label>Room Name</label>
          <input
            type="text"
            value={editRoom.name || ""}
            onChange={(e) => setEditRoom({ ...editRoom, name: e.target.value })}
            required
          />
          <label>Room Type</label>
          <select
            value={editRoom.type || ""}
            onChange={(e) => setEditRoom({ ...editRoom, type: e.target.value })}
            required
            style={{
              padding: "0.8rem",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            <option value="Single">Single</option>
            <option value="Double Deluxe">Double Deluxe</option>
            <option value="Family Deluxe">Family Deluxe</option>
            <option value="Presidential Deluxe">Presidential Deluxe</option>
          </select>
          <label>Price</label>
          <input
            type="number"
            value={editRoom.price || ""}
            onChange={(e) =>
              setEditRoom({ ...editRoom, price: e.target.value })
            }
            required
          />
          <label>Description</label>
          <textarea
            value={editRoom.description || ""}
            onChange={(e) =>
              setEditRoom({ ...editRoom, description: e.target.value })
            }
            required
          />
          <label>Amenities</label>
          <input
            type="text"
            placeholder="Amenities (comma-separated)"
            value={
              Array.isArray(editRoom.amenities)
                ? editRoom.amenities.join(", ")
                : editRoom.amenities || ""
            }
            onChange={(e) =>
              setEditRoom({ ...editRoom, amenities: e.target.value })
            }
          />
          <label>Upload New Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <button type="submit">Update Room</button>
          <button
            type="button"
            onClick={() => {
              setEditRoom(null);
              setImage(null);
            }}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default AdminPanel;
