const express = require('express');
const router = express.Router();
const {
    createPost,
    getPosts,
    getMyPosts,
    likePost,
    unlikePost,
    addComment,
    deletePost
} = require('../controllers/postController');

// 📝 Create a new post
// POST /api/posts
router.post('/', async (req, res) => {
    const { userId, text, image } = req.body;

    const result = await createPost(userId, text, image);
    if (result.error) return res.status(400).json({ error: result.error });

    res.status(201).json(result.data);
});

// 🏠 Get all posts (homepage feed)
// GET /api/posts
router.get('/', async (req, res) => {
    const result = await getPosts();
    if (result.error) return res.status(500).json({ error: result.error });

    res.json(result.data);
});

// 👤 Get posts of a specific user
// GET /api/posts/user/:userId
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;

    const result = await getMyPosts(userId);
    if (result.error) return res.status(400).json({ error: result.error });

    res.json(result.data);
});

// 👍 Like a post
// PUT /api/posts/like
router.put('/like', async (req, res) => {
    const { postId, userId } = req.body;

    const result = await likePost(postId, userId);
    if (result.error) return res.status(400).json({ error: result.error });

    res.json(result.data);
});

// 👎 Unlike a post
// PUT /api/posts/unlike
router.put('/unlike', async (req, res) => {
    const { postId, userId } = req.body;

    const result = await unlikePost(postId, userId);
    if (result.error) return res.status(400).json({ error: result.error });

    res.json(result.data);
});

// 💬 Add comment to a post
// POST /api/posts/comment
router.post('/comment', async (req, res) => {
    const { postId, userId, text } = req.body;

    const result = await addComment(postId, userId, text);
    if (result.error) return res.status(400).json({ error: result.error });

    res.json(result.data);
});

// 🗑️ DELETE /api/posts/:postId
router.delete('/:postId', async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ error: 'userId required in body' });

  const result = await deletePost(postId, userId);
  if (result.error) return res.status(400).json({ error: result.error });

  res.json({ message: result.data });
});

module.exports = router;
