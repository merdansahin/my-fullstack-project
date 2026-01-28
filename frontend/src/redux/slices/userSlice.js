import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  const res = await api.get("/api/user");
  return res.data;
});

const initialState = {
  userInfo: null,
  token: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.userInfo = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
