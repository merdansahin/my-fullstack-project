import React, { useState } from "react";
import axios from "axios";

function AdminAddRoom() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("image", image);

    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(`${process.env.REACT_APP_API_URL}/rooms`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Room added successfully!");
      setName("");
      setPrice("");
      setImage(null);
    } catch (error) {
      console.error(error);
      alert("Error adding room");
    }
  };

  return (
    <div className="admin-add-room">
      <h2>Add New Room</h2>
      <form onSubmit={handleSubmit}>
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
    </div>
  );
}

export default AdminAddRoom;
