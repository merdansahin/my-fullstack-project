import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

export const fetchRooms = createAsyncThunk("rooms/fetchRooms", async () => {
  const res = await api.get("/api/rooms");
  return res.data;
});

const roomsSlice = createSlice({
  name: "rooms",
  initialState: { list: [], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchRooms.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default roomsSlice.reducer;
