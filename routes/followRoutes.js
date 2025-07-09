const express = require('express');
const router = express.Router();
const followController = require("../controllers/followController");

// Send a follow request
router.post('/request', async (req, res) => {
    const { fromUserId, toUserId } = req.body;
    const result = await followController.sendFollowRequest(fromUserId, toUserId);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    res.json(result.data);
});

//  Respond to a follow request (accept/decline)
router.put('/respond', async (req, res) => {
    const { requestId, userId, status } = req.body;
    const result = await followController.respondFollowRequest(requestId, userId, status);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    res.json(result.data);
});

// Get follow requests sent to the logged-in user
router.get('/requests/:userId', async (req, res) => {
    const { userId } = req.params;
    const result = await followController.getMyFollowRequests(userId);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    res.json(result.data);
});

module.exports = router;