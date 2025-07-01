// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController'); // adjust path if needed

// Register Route
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const result = await registerUser(name, email, password);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    res.status(201).json(result);
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    res.status(200).json(result);
});

module.exports = router;