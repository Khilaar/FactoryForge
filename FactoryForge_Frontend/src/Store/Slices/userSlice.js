import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    access_token: undefined,
  },
  reducers: {
    login_user: (state, action) => {
      state.access_token = action.payload;
    },
    logout_user: (state) => {
      state.access_token = null;
      localStorage.removeItem("access_token");
    },
    load_user: (state, action) => {
      state.details = action.payload;
    },
  },
});

export const { login_user, logout_user, load_user } = userSlice.actions;

export default userSlice.reducer;
