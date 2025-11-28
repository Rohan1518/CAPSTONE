# E-Waste Locator Project - AI Agent Instructions

## Architecture Overview
- **Frontend**: React SPA with Redux (`frontend/`) using React Router for navigation
- **Backend**: Express.js REST API (`backend/`) with MongoDB and Socket.IO
- **Blockchain**: Hardhat-based smart contracts (`blockchain/`) for e-waste tracking
- **IoT**: Raspberry Pi sensor gateway (`iot-devices/`) for hardware integration
- **AI Services**: Computer vision and machine learning services (`ai-services/`)

## Key Patterns & Conventions

### Backend Architecture
- Controllers handle request/response (`backend/src/controllers/`)
- Services contain business logic (`backend/src/services/`)
- Models define MongoDB schemas (`backend/src/models/`)
- Socket.IO for real-time updates (see `backend/src/server.js`)

### Frontend Structure
- Pages represent full routes (`frontend/src/pages/`)
- Components are reusable UI elements (`frontend/src/components/`)
- Redux for state management (`frontend/src/store/`)

### Cross-Cutting Features
- Real-time updates use Socket.IO (connect via `socket.io-client` in frontend)
- Authentication via JWT tokens (see `authMiddleware.js`)
- File uploads handled by Multer (`backend/src/controllers/`)
- Blockchain integration through ethers.js

## Development Workflow
```bash
# Backend Development
cd backend
npm install
npm run dev  # Starts server with nodemon

# Frontend Development
cd frontend
npm install
npm start    # Runs on localhost:3000
```

## Integration Points
- Backend API: `http://localhost:5000/api/v1`
- WebSocket: `ws://localhost:5000`
- Smart Contracts: See `blockchain/contracts/`
- IoT Gateway: Connects via `iotRoutes.js`

## Project-Specific Conventions
- Controllers use try-catch with standardized error responses
- Routes are versioned in URL path (`/api/v1/...`)
- Components follow atomic design principles
- Real-time features use socket.io events for pub/sub