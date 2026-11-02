import { createSlice } from "@reduxjs/toolkit";

const getCachedUser = () => {
  try {
    const raw = localStorage.getItem("techquiz_user");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

const usersSlice = createSlice({
  name: "users",
  initialState: {
    user: getCachedUser(),
  },
  reducers: {
    SetUser: (state, action) => {
      state.user = action.payload;
      try {
        if (action.payload) {
          localStorage.setItem("techquiz_user", JSON.stringify(action.payload));
        } else {
          localStorage.removeItem("techquiz_user");
        }
      } catch (e) {
        // storage quota or private browsing
      }
    },
  },
});

export const { SetUser } = usersSlice.actions;
export default usersSlice.reducer;
