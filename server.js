const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const followRoutes = require('./routes/followRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);           // Signup/Login/Logout
app.use('/api/users', userRoutes);          // Profile, Follow, Search, Export PDF
app.use('/api/posts', postRoutes);          // Posts (Home Page, Create, List)
app.use('/api/follow', followRoutes);       // Follow Requests (Send, Accept/Decline)
app.use('/api/messages', messageRoutes);    // One-to-one Chat

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to DevBook API!');
});

// Error Handling Middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
