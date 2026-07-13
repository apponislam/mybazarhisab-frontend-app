import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

type TAuthState = {
  isLoggedIn: boolean;
  userEmail: string | null;
  token: string | null;
};

const initialState: TAuthState = {
  isLoggedIn: false,
  userEmail: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string; token: string }>) => {
      state.isLoggedIn = true;
      state.userEmail = action.payload.email;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userEmail = null;
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors matching letanest style
export const isLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const currentUserEmail = (state: RootState) => state.auth.userEmail;
export const currentToken = (state: RootState) => state.auth.token;
