import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

interface User {
  _id: string;
  username: string;
  email: string;
  token?: string;
}

interface UserState {
  currentUser: { user: User; token: string } | null;
  error: string | null;
  loading: boolean;
}

const initialState: UserState = {
  currentUser: null,
  error: null,
  loading: false,
};

const getTokenExpirationTime = (token: string): number | null => {
  try {
    const decoded: { exp: number } = jwtDecode(token);
    return decoded.exp * 1000;
  } catch (error) {
    return null;
  }
};

const handleTokenExpiration = (token: string, callback: () => void) => {
  const expTime = getTokenExpirationTime(token);
  if (expTime) {
    const remainingTime = expTime - Date.now();
    if (remainingTime > 0) {
      setTimeout(() => {
        callback();
        Cookies.remove("token");
      }, remainingTime);
    } else {
      callback();
      Cookies.remove("token");
    }
  }
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;

      const token = action.payload.token;
      handleTokenExpiration(token, () => {
        state.currentUser = null;
      });
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state) => {
      state.currentUser = null;
      state.loading = false;
    },
    signOutUserStart: (state) => {
      state.loading = true;
    },
    signOutUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    signOutUserFailure: (state) => {
      state.currentUser = null;
      state.loading = false;
    },
    resetState: () => initialState,
  },
});

export const onRehydrateComplete = (state: UserState) => {
  if (state.currentUser && state.currentUser.token) {
    const token = state.currentUser.token;
    const expTime = getTokenExpirationTime(token);

    if (expTime && expTime < Date.now()) {
      state.currentUser = null;
      Cookies.remove("token");
    }
  }
};

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  resetState,
} = userSlice.actions;

export default userSlice.reducer;
