const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/database');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const jwt = require('jsonwebtoken'); 
const User = require('./models/User'); 

// --- Import ALL Routes ---
const authRoutes = require('./routes/authRoutes');
const componentRoutes = require('./routes/componentRoutes');
const forumRoutes = require('./routes/forumRoutes');
const userRoutes = require('./routes/userRoutes');
const shopRoutes = require('./routes/shopRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); // Import notification routes

dotenv.config();
connectDB();

const app = express();

// --- Socket.IO Setup (Moved Up) ---
// We create the server and io instances here
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "http://192.168.42.1:3001"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// A simple in-memory map to track connected users { userId: socketId }
const onlineUsers = new Map(); 

// --- Socket.IO Connection Logic ---
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  socket.on('authenticate', async (token) => {
    try {
        if (!token) {
           console.log(`Socket ${socket.id} authentication failed: No token provided.`);
           return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user) {
            socket.userId = user._id.toString(); 
            onlineUsers.set(socket.userId, socket.id);
            socket.join(socket.userId); // Join user-specific room
            console.log(`✅ Socket ${socket.id} authenticated as user ${socket.userId}`);
        } else {
             console.log(`Socket ${socket.id} authentication failed: User not found.`);
        }
    } catch (error) {
        console.log(`Socket ${socket.id} authentication error: ${error.message}`);
    }
  });

  socket.on('chat message', (msg) => {
    console.log('message received from', socket.id, ':', msg);
    io.emit('chat message', { id: socket.id, message: msg });
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
    if (socket.userId) {
        onlineUsers.delete(socket.userId);
        console.log(`User ${socket.userId} went offline.`);
    }
  });
});
// --- End Socket.IO Setup ---


// --- Middleware ---
app.use(cors({ 
  origin: ["http://localhost:3000", "http://localhost:3001", "http://192.168.42.1:3001"],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// 👇 NEW MIDDLEWARE: Attach io and onlineUsers to every request
app.use((req, res, next) => {
    req.io = io; // Make io accessible in controllers
    req.onlineUsers = onlineUsers; // Make online user map accessible
    next();
});
// --- END NEW MIDDLEWARE ---

// --- Serve Static Files (Images) ---
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// --- Mount ALL Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/users', userRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/notifications', notificationRoutes); // Mount notification routes

const PORT = process.env.PORT || 5000;

// --- Start Server ---
server.listen(PORT, () => console.log(`🚀 Server (HTTP + WebSocket) running on port ${PORT}`));

// REMOVED module.exports, as server.js is the entry point, not a module