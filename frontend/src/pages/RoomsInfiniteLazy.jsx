import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

function RoomsInfiniteLazy() {
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 6;

  const fetchRooms = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/rooms?page=${page}&limit=${limit}`,
      );
      setRooms((prev) => [...prev, ...res.data.rooms]);
      setHasMore(page < res.data.totalPages);
    } catch (error) {
      console.error(error);
    }
  }, [page]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        if (hasMore) {
          setPage((prev) => prev + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  return (
    <div className="rooms-page">
      <h2>Available Rooms (Infinite + Lazy)</h2>
      <div className="rooms-list">
        {rooms.map((room) => (
          <div key={room._id} className="room-card">
            <LazyLoadImage
              src={room.imageUrl.replace(
                "/upload/",
                "/upload/q_auto,f_auto,w_400/",
              )}
              alt={room.name}
              effect="blur"
              width="100%"
              height="200px"
            />
            <h3>{room.name}</h3>
            <p>Price: ${room.price}</p>
          </div>
        ))}
      </div>
      {!hasMore && <p style={{ textAlign: "center" }}>No more rooms to load</p>}
    </div>
  );
}

export default RoomsInfiniteLazy;
