import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function AdminPanel() {
  const { token, user } = useSelector((state) => state.user);
  const [rooms, setRooms] = useState([]);
  const [editRoom, setEditRoom] = useState(null);

  const [newRoom, setNewRoom] = useState({
    name: "",
    type: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/rooms`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRooms(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (token) fetchRooms();
  }, [token]);

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/rooms`,
        newRoom,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setRooms([...rooms, res.data]);
      setNewRoom({ name: "", type: "", price: "", description: "" });
    } catch (error) {
      alert("Error adding room");
    }
  };

  const handleDeleteRoom = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/rooms/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(rooms.filter((room) => room._id !== id));
    } catch (error) {
      alert("Error deleting room");
    }
  };
  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/rooms/${editRoom._id}`,
        editRoom,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setRooms(
        rooms.map((room) => (room._id === editRoom._id ? res.data : room)),
      );
      setEditRoom(null);
    } catch (error) {
      alert("Error updating room");
    }
  };

  if (!user || user.role !== "admin") {
    return <p>Access denied. Admins only.</p>;
  }

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>

      <form onSubmit={handleAddRoom} className="add-room-form">
        <input
          type="text"
          placeholder="Room Name"
          value={newRoom.name}
          onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Type"
          value={newRoom.type}
          onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={newRoom.price}
          onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={newRoom.description}
          onChange={(e) =>
            setNewRoom({ ...newRoom, description: e.target.value })
          }
          required
        />
        <button type="submit">Add Room</button>
      </form>

      <h3>Existing Rooms</h3>
      <ul>
        {rooms.map((room) => (
          <li key={room._id}>
            <strong>{room.name}</strong> - ${room.price}
            <button onClick={() => handleDeleteRoom(room._id)}>Delete</button>
          </li>
        ))}
      </ul>

      {editRoom && (
        <form onSubmit={handleUpdateRoom} className="edit-room-form">
          <h3>Edit Room</h3>
          <input
            type="text"
            value={editRoom.name}
            onChange={(e) => setEditRoom({ ...editRoom, name: e.target.value })}
            required
          />
          <input
            type="text"
            value={editRoom.type}
            onChange={(e) => setEditRoom({ ...editRoom, type: e.target.value })}
            required
          />
          <input
            type="number"
            value={editRoom.price}
            onChange={(e) =>
              setEditRoom({ ...editRoom, price: e.target.value })
            }
            required
          />
          <textarea
            value={editRoom.description}
            onChange={(e) =>
              setEditRoom({ ...editRoom, description: e.target.value })
            }
            required
          />
          <button type="submit">Update Room</button>
          <button type="button" onClick={() => setEditRoom(null)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default AdminPanel;
