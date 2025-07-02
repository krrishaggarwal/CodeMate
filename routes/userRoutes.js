const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateProfile,
    searchUsers
} = require('../controllers/userController');
router.get('/export/:userId', downloadUserProfilePDF);


// 📥 Get a user's profile by ID
// GET /api/users/:userId
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    const result = await getProfile(userId);
    if (result.error) {
        return res.status(404).json({ error: result.error });
    }

    res.status(200).json(result.data);
});

// ✏️ Update a user's profile
// PUT /api/users/update/:userId
router.put('/update/:userId', async (req, res) => {
    const { userId } = req.params;
    const updates = req.body;

    const result = await updateProfile(userId, updates);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }

    res.status(200).json(result.data);
});

// 🔍 Search users by name, email, or skills
// GET /api/users/search?keyword=krish
router.get('/search', async (req, res) => {
    const { keyword } = req.query;

    const result = await searchUsers(keyword || '');
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }

    res.status(200).json(result.data);
});

module.exports = router;
