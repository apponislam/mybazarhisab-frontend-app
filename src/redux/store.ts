import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './features/auth/authSlice';
import ledgerReducer from './features/ledger/ledgerSlice';
import { baseApi } from './api/baseApi';

const persistAuthConfigure = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['isLoggedIn', 'user', 'token'],
};

const persistLedgerConfigure = {
  key: 'ledger',
  storage: AsyncStorage,
};

const persistAuthReducer = persistReducer(persistAuthConfigure, authReducer);
const persistLedgerReducer = persistReducer(persistLedgerConfigure, ledgerReducer);

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: persistAuthReducer,
    ledger: persistLedgerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
export default store;
