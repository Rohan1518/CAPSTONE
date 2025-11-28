import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import notificationReducer from './slices/notificationSlice'; // 👈 1. Import the new reducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationReducer, // 👈 2. Add the reducer to the store
  },
});