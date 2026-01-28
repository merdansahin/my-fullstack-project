import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminRoomManagement() {
  const [rooms, setRooms] = useState([]);
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
    <div className="admin-room-management">
      <h2>Room Management</h2>
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

export default AdminRoomManagement;
