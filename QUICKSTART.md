# E-Waste Locator - Quick Start Guide

## Installation

1. Install all dependencies (run this once):
```bash
npm run install-all
```

This will install dependencies for:
- Root project
- Backend
- Frontend

## Running the Application

### Option 1: Run Everything in One Terminal
```bash
npm start
```

This will start both:
- Backend server on http://localhost:5000
- Frontend server on http://localhost:3001

### Option 2: Run Individually
```bash
# Terminal 1 - Backend
npm run backend

# Terminal 2 - Frontend
npm run frontend
```

## Access Points

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5000
- **Admin Login**: http://localhost:3001/admin-login
- **User Login**: http://localhost:3001/user-login

## First Time Setup

1. Install dependencies:
   ```bash
   npm run install-all
   ```

2. Make sure MongoDB is running

3. Create `.env` file in backend folder with:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

4. Start the application:
   ```bash
   npm start
   ```

## Stopping the Application

Press `Ctrl+C` in the terminal to stop both servers.
