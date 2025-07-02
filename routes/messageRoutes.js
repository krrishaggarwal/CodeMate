const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Middleware to protect routes (e.g., to get req.user.id)
const authMiddleware = require('../middleware/authMiddleware');

// Send a message (POST /api/messages)
router.post('/', authMiddleware, messageController.sendMessage);

// Get messages with a specific user (GET /api/messages/:userId)
router.get('/:userId', authMiddleware, messageController.getMessages);

module.exports = router;