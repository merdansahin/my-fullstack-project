import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminPanelRoomsCloudinary() {
  const [rooms, setRooms] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedPrice, setUpdatedPrice] = useState("");

  // Odaları çek
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/rooms`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRooms(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRooms();
  }, []);

  // Yeni oda ekle (Cloudinary upload)
  const handleAddRoom = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("image", image);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/rooms`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setRooms([...rooms, res.data]);
      setName("");
      setPrice("");
      setImage(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Oda sil
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${process.env.REACT_APP_API_URL}/rooms/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(rooms.filter((room) => room._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Oda güncelle
  const handleUpdate = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/rooms/${id}`,
        { name: updatedName, price: updatedPrice },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setRooms(rooms.map((room) => (room._id === id ? res.data : room)));
      setEditingRoom(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="admin-panel-rooms">
      <h2>Admin Room Panel (Cloudinary)</h2>

      {/* Yeni oda ekleme formu */}
      <form onSubmit={handleAddRoom}>
        <div>
          <label>Room Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Room Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>

        <button type="submit">Add Room</button>
      </form>

      {/* Mevcut odaları listeleme */}
      <h3>Existing Rooms</h3>
      <ul>
        {rooms.map((room) => (
          <li key={room._id}>
            {editingRoom === room._id ? (
              <div>
                <input
                  type="text"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  placeholder="Room Name"
                />
                <input
                  type="number"
                  value={updatedPrice}
                  onChange={(e) => setUpdatedPrice(e.target.value)}
                  placeholder="Price"
                />
                <button onClick={() => handleUpdate(room._id)}>Save</button>
                <button onClick={() => setEditingRoom(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <p>
                  <strong>{room.name}</strong> - ${room.price}
                </p>
                <img src={room.imageUrl} alt={room.name} width="120" />
                <button onClick={() => setEditingRoom(room._id)}>Edit</button>
                <button onClick={() => handleDelete(room._id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanelRoomsCloudinary;
