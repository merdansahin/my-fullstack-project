import api from "../api/axios"; // axios instance

export const fetchRooms = async () => {
  try {
    const response = await api.get("/rooms");
    return response.data; // return rooms
  } catch (error) {
    if (error.response) {
      // The server responded, but with an error code (e.g., 404, 500)
      console.error("Server error:", error.response.data);
    } else if (error.request) {
      // The request was sent, but no response was received
      console.error("Cannot reach server:", error.message);
    } else {
      // The request could not be sent (axios config error, etc.)
      console.error("Request failed:", error.message);
    }
    return []; // return an empty array in case of an error
  }
};

export const getRoomById = async (id) => {
  try {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(`Error fetching room ${id}:`, error.response.data);
    } else if (error.request) {
      console.error("Server not responding:", error.message);
    } else {
      console.error("Request setup error:", error.message);
    }
    return null;
  }
};
