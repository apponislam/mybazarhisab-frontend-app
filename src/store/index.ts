import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import ledgerReducer from './ledgerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ledger: ledgerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
