const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {
    getProfile,
    updateProfile,
    searchUsers,
    downloadUserProfilePDF,
    getUserStats // ✅ added PDF export function
} = require('../controllers/userController');

// 📤 Export user's profile as PDF
// GET /api/users/export/:userId
router.get('/export/:userId', downloadUserProfilePDF);


// 📄 Get all users (used when no search keyword is given)
// GET /api/users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // exclude password
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
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

router.get('/stats/:id', getUserStats);

module.exports = router;
