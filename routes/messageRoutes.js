const express = require('express');
const router = express.Router();
const messageController = require("../controllers/messageController");

// Send a message
router.post('/send', async (req, res) => {
    const { fromUserId, toUserId, text } = req.body;
    const result = await messageController.sendMessage(fromUserId, toUserId, text);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    res.json(result.data);
});

// Get all messages between two users
router.get('/:userId1/:userId2', async (req, res) => {
    const { userId1, userId2 } = req.params;
    const result = await messageController.getMessages(userId1, userId2);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    res.json(result.data);
});

module.exports = router;