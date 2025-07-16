const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');             // ✅ Required for socket.io
const { Server } = require('socket.io');  // ✅ Socket.IO server

const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Load environment variables
dotenv.config();

// Init express app
const app = express();
const server = http.createServer(app); // ✅ Create HTTP server

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const followRoutes = require('./routes/followRoutes');
const messageRoutes = require('./routes/messageRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/messages', messageRoutes);
// Test root route
app.get('/', (req, res) => {
  res.send('🚀 Welcome to CodeMate API!');
});

// Global error handler
app.use(errorHandler);

// ==============================
// ✅ SOCKET.IO Real-time Chat
// ==============================
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log(`🟢 Socket connected: ${socket.id}`);

  // Join room based on user ID
  socket.on('join', (userId) => {
    socket.join(userId);
  });

  // Handle message send
  socket.on('send_message', ({ senderId, receiverId, content }) => {
    // Broadcast to receiver's room
    io.to(receiverId).emit('receive_message', {
      senderId,
      content,
      timestamp: new Date(),
    });
  });

  socket.on('disconnect', () => {
    console.log(`🔴 Socket disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
