import { createSlice } from "@reduxjs/toolkit";
import api from "../services/api";

const token = localStorage.getItem("token");

const userSlice = createSlice({
  name: "user",
  initialState: {
    token: token ? JSON.parse(token) : null,
    isAuthenticated: token ? true : false,
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.loginUser.matchFulfilled,
      (state, action) => {
        (state.token = action.payload?.user?.token),
          (state.isAuthenticated = true);
        localStorage.setItem(
          "token",
          JSON.stringify(action.payload?.user?.token)
        );
      }
    )
    .addMatcher(
      api.endpoints.googleLogin.matchFulfilled,
      (state, action) => {
        (state.token = action.payload?.user?.token),
        (state.isAuthenticated = true);
      localStorage.setItem(
        "token",
        JSON.stringify(action.payload?.user?.token)
      ); 
      }
    )
    .addMatcher(api.endpoints.logoutUser.matchFulfilled, (state) =>{
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    })
  },
});

export const userReducer = userSlice.reducer;
