import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export type TUser = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  role?: string;
};

type TAuthState = {
  isLoggedIn: boolean;
  user: TUser | null;
  token: string | null;
  hasGroup: boolean | null;
};

const initialState: TAuthState = {
  isLoggedIn: false,
  user: null,
  token: null,
  hasGroup: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user?: TUser; email?: string; token: string }>) => {
      state.isLoggedIn = true;
      if (action.payload.user) {
        state.user = action.payload.user;
      } else if (action.payload.email) {
        if (state.user) {
          state.user.email = action.payload.email;
        } else {
          state.user = { _id: 'unknown', name: 'User', email: action.payload.email };
        }
      }
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      state.hasGroup = null;
    },
    setHasGroup: (state, action: PayloadAction<boolean>) => {
      state.hasGroup = action.payload;
    },
  },
});

export const { login, logout, setHasGroup } = authSlice.actions;
export default authSlice.reducer;

// Selectors matching letanest style
export const isLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const currentUser = (state: RootState) => state.auth.user;
export const currentUserEmail = (state: RootState) => state.auth.user?.email || null;
export const currentToken = (state: RootState) => state.auth.token;
export const hasGroup = (state: RootState) => state.auth.hasGroup;
