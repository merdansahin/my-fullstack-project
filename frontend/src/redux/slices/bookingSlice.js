import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk → backend’den rezervasyonları çekmek için
export const fetchBookings = createAsyncThunk(
  "booking/fetchBookings",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.get("/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

// Async thunk → yeni rezervasyon eklemek için
export const addBooking = createAsyncThunk(
  "booking/addBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.post("/api/bookings", bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    bookings: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearBookings: (state) => {
      state.bookings = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchBookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // addBooking
      .addCase(addBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload);
      })
      .addCase(addBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
