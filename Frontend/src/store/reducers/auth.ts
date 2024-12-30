// action - state management
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// types
import { AuthProps } from 'types/auth';

// initial state
export const initialState: AuthProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null,
  userSocial: null
  // dataRoles: []
};

// ==============================|| AUTH REDUCER ||============================== //

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStore: (state, action: PayloadAction<{ user: any; isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.isInitialized = true;
      state.user = action.payload.user;
    },
    logoutStore: (state) => {
      state.isInitialized = true;
      state.isLoggedIn = false;
      state.user = null;
    },
    registerStore: (state, action: PayloadAction<{ userSocial: any }>) => {
      state.userSocial = action.payload.userSocial;
    }
    // setDataRoles: (state, action: PayloadAction<any[]>) => {
    //   state.dataRoles = action.payload; // Lưu trữ dataRoles
    // },
    // clearDataRoles: (state) => {
    //   state.dataRoles = []; // Xóa dataRoles
    // }
  }
});

export default authSlice.reducer;

export const { loginStore, logoutStore, registerStore } = authSlice.actions;
