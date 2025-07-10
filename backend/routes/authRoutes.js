// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");

// Register Route
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const result = await authController.registerUser(name, email, password);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    res.json(result);
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    res.json(result);
});

module.exports = router;