import { User } from "@/interfaces/User";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(
      state: AuthState,
      action: PayloadAction<{ accessToken: string; user: User }>
    ) {
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.user = null;
      Cookies.remove("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;

export default authSlice.reducer;
