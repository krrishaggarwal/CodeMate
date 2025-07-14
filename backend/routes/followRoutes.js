const express = require('express');
const router = express.Router();
const {
    sendFollowRequest,
    respondFollowRequest,
    getMyFollowRequests
} = require('../controllers/followController');

// 🟢 Send a follow request
// POST /api/follow/request
router.post('/request', async (req, res) => {
    const { fromUserId, toUserId } = req.body;

    const result = await sendFollowRequest(fromUserId, toUserId);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }

    res.status(200).json(result.data);
});

// 🔄 Respond to a follow request (accept/decline)
// PUT /api/follow/respond
router.put('/respond', async (req, res) => {
    const { requestId, userId, status } = req.body;

    const result = await respondFollowRequest(requestId, userId, status);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }

    res.status(200).json(result.data);
});

// 📥 Get follow requests sent to the logged-in user
// GET /api/follow/requests/:userId
router.get('/requests/:userId', async (req, res) => {
    const { userId } = req.params;

    const result = await getMyFollowRequests(userId);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }

    res.status(200).json(result.data);
});

module.exports = router;
