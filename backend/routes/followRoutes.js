const express = require('express');
const router = express.Router();
const {
    sendFollowRequest,
    respondFollowRequest,
    getMyFollowRequests,
    checkFollowStatus
} = require('../controllers/followController');

// 🟢 Send a follow request
router.post('/request', async (req, res) => {
    const { fromUserId, toUserId } = req.body;
    const result = await sendFollowRequest(fromUserId, toUserId);
    if (result.error) return res.status(400).json({ error: result.error });
    res.status(200).json(result.data);
});

// 🔄 Accept or decline follow request
router.put('/respond', async (req, res) => {
    const { requestId, userId, status } = req.body;
    const result = await respondFollowRequest(requestId, userId, status);
    if (result.error) return res.status(400).json({ error: result.error });
    res.status(200).json(result.data);
});

// 📥 Get received follow requests
router.get('/requests/:userId', async (req, res) => {
    const { userId } = req.params;
    const result = await getMyFollowRequests(userId);
    if (result.error) return res.status(400).json({ error: result.error });
    res.status(200).json(result.data);
});

// ✅ Check follow status between two users
router.get('/status/:id', checkFollowStatus);

module.exports = router;
