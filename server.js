const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Load environment variables from .env
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Core Middleware
app.use(cors());              // Enable Cross-Origin requests
app.use(express.json());      // Parse incoming JSON
app.use(morgan('dev'));       // Log HTTP requests

// Route Imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const followRoutes = require('./routes/followRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);           // 🔐 Auth (register/login/logout)
app.use('/api/users', userRoutes);          // 👤 User profile/search/export
app.use('/api/posts', postRoutes);          // 📝 Post create/feed/like/comment
app.use('/api/follow', followRoutes);       // ➕ Follow requests (send/accept)
app.use('/api/messages', messageRoutes);    // 💬 One-to-one messaging

// Test root route
app.get('/', (req, res) => {
    res.send('🚀 Welcome to CodeMate API!');
});

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});