import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    notifications: [], // An array to hold notification objects
    unreadCount: 0,
};

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Action to add a new notification
    addNotification: (state, action) => {
      // Add the new notification to the beginning of the array
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    // Action to mark all notifications as read
    markAllAsRead: (state) => {
      state.unreadCount = 0;
      // You could also add a 'read: true' flag to each notification object
    },
    // Action to clear all notifications
    clearNotifications: (state) => {
        state.notifications = [];
        state.unreadCount = 0;
    }
  },
});

// Export the actions
export const { addNotification, markAllAsRead, clearNotifications } = notificationSlice.actions;

// Export the reducer
export default notificationSlice.reducer;