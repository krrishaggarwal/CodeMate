const express = require('express');
const router = express.Router();

const {
  createPost,
  getPosts,
  getMyPosts,
  likePost,
  unlikePost,
  addComment,
  deletePost,
  getPostById
} = require('../controllers/postController');

const Post = require('../models/post');

// 📝 Create a new post
router.post('/', async (req, res) => {
  const { userId, text, image } = req.body;
  const result = await createPost(userId, text, image);
  if (result.error) return res.status(400).json({ error: result.error });
  res.status(201).json(result.data);
});

// 🏠 Get all posts
router.get('/', async (req, res) => {
  const result = await getPosts();
  if (result.error) return res.status(500).json({ error: result.error });
  res.json(result.data);
});

// 🎲 Get random posts
router.get('/random', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const randomPosts = await Post.aggregate([{ $sample: { size: limit } }]);

    // Fully populate user and commenters
    const populatedPosts = await Post.populate(randomPosts, [
      { path: 'user', select: 'name avatar bio' },
      { path: 'comments.user', select: 'name avatar' }
    ]);

    res.json(populatedPosts);
  } catch (err) {
    console.error('Error fetching random posts:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 👤 Get posts of a specific user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const result = await getMyPosts(userId);
  if (result.error) return res.status(400).json({ error: result.error });
  res.json(result.data);
});

// 👍 Like a post
router.put('/like', async (req, res) => {
  const { postId, userId } = req.body;
  const result = await likePost(postId, userId);
  if (result.error) return res.status(400).json({ error: result.error });
  res.json(result.data);
});

// 👎 Unlike a post
router.put('/unlike', async (req, res) => {
  const { postId, userId } = req.body;
  const result = await unlikePost(postId, userId);
  if (result.error) return res.status(400).json({ error: result.error });
  res.json(result.data);
});

// 💬 Add a comment to a post
router.post('/comment', async (req, res) => {
  const { postId, userId, text } = req.body;
  const result = await addComment(postId, userId, text);
  if (result.error) return res.status(400).json({ error: result.error });
  res.json(result.data);
});

// 🗑️ Delete a post
router.delete('/:postId', async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ error: 'userId required in body' });

  const result = await deletePost(postId, userId);
  if (result.error) return res.status(400).json({ error: result.error });

  res.json({ message: result.data });
});

// 🔍 Get a single post by ID
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await getPostById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    console.error('Error fetching post by ID:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
