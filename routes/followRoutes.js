// const express = require('express');
// const router = express.Router();
// const followController = require('../controllers/followController');
// const authMiddleware = require('../middleware/authMiddleware');

// // Send a follow request
// router.post('/request', authMiddleware, followController.sendFollowRequest);

// // Respond to a follow request (accept/decline)
// router.put('/request/:requestId', authMiddleware, followController.respondFollowRequest);

// // Get all follow requests received by the current user
// router.get('/requests', authMiddleware, followController.getMyFollowRequests);

// module.exports = router;


const express = require('express');
const router = express.Router();
const {
    sendFollowRequest,
    respondFollowRequest,
    getMyFollowRequests
} = require('../controllers/followController');

// Middleware to protect routes (you must have this in your project)
const authenticate = require('../middleware/auth');

// Send a follow request
router.post('/send/:toUserId', authenticate, async (req, res) => {
    const fromUserId = req.user.id; // Extracted from token
    const { toUserId } = req.params;

    const result = await sendFollowRequest(fromUserId, toUserId);
    if (result.error) return res.status(400).json({ error: result.error });
    return res.status(201).json(result.data);
});

// Respond to a follow request (accept/decline)
router.put('/respond/:requestId', authenticate, async (req, res) => {
    const userId = req.user.id;
    const { requestId } = req.params;
    const { status } = req.body; // Expected: 'accepted' or 'declined'

    const result = await respondFollowRequest(requestId, userId, status);
    if (result.error) return res.status(400).json({ error: result.error });
    return res.status(200).json(result.data);
});

// Get all follow requests sent to the logged-in user
router.get('/my-requests', authenticate, async (req, res) => {
    const userId = req.user.id;

    const result = await getMyFollowRequests(userId);
    if (result.error) return res.status(400).json({ error: result.error });
    return res.status(200).json(result.data);
});

module.exports = router;
