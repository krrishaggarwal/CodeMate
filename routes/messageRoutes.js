const express = require('express');
const router = express.Router();
const {
    sendMessage,
    getMessages
} = require('../controllers/messageController');

// 📤 Send a message
// POST /api/messages/send
router.post('/send', async (req, res) => {
    const { fromUserId, toUserId, text } = req.body;

    const result = await sendMessage(fromUserId, toUserId, text);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }

    res.status(200).json(result.data);
});

// 📥 Get all messages between two users
// GET /api/messages/:userId1/:userId2
router.get('/:userId1/:userId2', async (req, res) => {
    const { userId1, userId2 } = req.params;

    const result = await getMessages(userId1, userId2);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }

    res.status(200).json(result.data);
});

module.exports = router;