import { createSlice } from '@reduxjs/toolkit';

// This is the initial state when the app loads.
// We'll try to get user data from localStorage if they were already logged in.
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user : null,
  isAuthenticated: user ? true : false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  // Reducers are functions that change the state.
  reducers: {
    // This action will run when a user successfully logs in or registers
    loginSuccess: (state, action) => {
      state.user = action.payload; // action.payload will be the user data
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload)); // Save to localStorage
    },
    // This action will run when a user logs out
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user'); // Remove from localStorage
    },
  },
});

// Export the actions so our components can use them
export const { loginSuccess, logoutSuccess } = authSlice.actions;

// Export the reducer to be added to the main store
export default authSlice.reducer;