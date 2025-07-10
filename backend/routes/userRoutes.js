const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Export user profile as PDF
router.get("/export/:userId", userController.downloadUserProfilePDF);

// Search users
router.get("/search", async (req, res) => {
    let keyword = req.query.keyword;
    if (!keyword) {
        keyword = "";
    }
    const result = await userController.searchUsers(keyword);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    res.json(result.data);
});

// Get user profile
router.get("/:userId", async (req, res) => {
    const userId = req.params.userId;
    const result = await userController.getProfile(userId);
    if (result.error) {
        return res.status(404).json({ error: result.error });
    }
    res.json(result.data);
});

// Update user profile
router.put("/update/:userId", async (req, res) => {
    const userId = req.params.userId;
    const updates = req.body;
    const result = await userController.updateProfile(userId, updates);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    res.json(result.data);
});

module.exports = router;