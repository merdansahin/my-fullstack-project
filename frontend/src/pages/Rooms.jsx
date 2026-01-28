import React, { useEffect, useState } from "react";
import { fetchRooms } from "../services/roomService.js";
import RoomCard from "../components/RoomCard";
import "../styles/rooms.css";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [roomType, setRoomType] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const res = await fetchRooms("/rooms");
        const roomsData = res?.data || [];
        setRooms(roomsData);
        setFilteredRooms(roomsData);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setRooms([]);
        setFilteredRooms([]);
      }
    };

    loadRooms(); // sadece bir kez çağrılır
  }, []);

  // Filtreleme
  const handleFilter = () => {
    let filtered = [...rooms];

    if (minPrice) {
      filtered = filtered.filter((room) => room.price >= parseInt(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((room) => room.price <= parseInt(maxPrice));
    }
    if (roomType) {
      filtered = filtered.filter((room) => room.type === roomType);
    }

    setFilteredRooms(filtered);
    handleSort(sortOption, filtered); // filtre sonrası sıralama da uygula
  };

  // Sıralama
  const handleSort = (option, data = filteredRooms) => {
    let sorted = [...data];
    if (option === "priceAsc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (option === "priceDesc") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (option === "nameAsc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (option === "nameDesc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    }
    setFilteredRooms(sorted);
    setSortOption(option);
  };

  return (
    <div className="rooms-page">
      <h2>Available Rooms</h2>
      {(filteredRooms || []).length === 0 ? (
        <p>No rooms found.</p>
      ) : (
        (filteredRooms || []).map((room) => (
          <RoomCard key={room._id} room={room} />
        ))
      )}

      {/* Filtreleme Formu */}
      <div className="filter-section">
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
          <option value="">All Types</option>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="suite">Suite</option>
        </select>
      </div>

      {/* Sıralama */}
      <div className="sort-section">
        <select value={sortOption} onChange={(e) => handleSort(e.target.value)}>
          <option value="">Sort By</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="nameAsc">Name: A-Z</option>
          <option value="nameDesc">Name: Z-A</option>
        </select>
      </div>

      {/* Oda Listesi */}
      <div className="rooms-list">
        {filteredRooms.map((room) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </div>
      <button onClick={handleFilter}>Apply Filters</button>
    </div>
  );
}

export default Rooms;
