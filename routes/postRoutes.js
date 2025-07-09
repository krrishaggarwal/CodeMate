const express = require('express');
const router = express.Router();
const postController = require("../controllers/postController");

// Create a new post
router.post('/', async (req, res) => {
    const { userId, text, image } = req.body;
    const result = await postController.createPost(userId, text, image);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    res.json(result.data);
});

// Get all posts
router.get('/', async (req, res) => {
    const result = await postController.getPosts();
    if (result.error) {
        return res.status(500).json({ error: result.error });
    }
    res.json(result.data);
});

// Get posts of a specific user
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    const result = await postController.getMyPosts(userId);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    res.json(result.data);
});

// Like a post
router.put('/like', async (req, res) => {
    const { postId, userId } = req.body;
    const result = await postController.likePost(postId, userId);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    res.json(result.data);
});

// Unlike a post
router.put('/unlike', async (req, res) => {
    const { postId, userId } = req.body;
    const result = await postController.unlikePost(postId, userId);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    res.json(result.data);
});

// Add comment to a post
router.post('/comment', async (req, res) => {
    const { postId, userId, text } = req.body;
    const result = await postController.addComment(postId, userId, text);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    res.json(result.data);
});

module.exports = router;