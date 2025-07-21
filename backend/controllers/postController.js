const mongoose = require('mongoose');
const Post = require('../models/post');

// 📌 Create a new post
const createPost = async (userId, text, image) => {
    try {
        const post = await Post.create({ user: userId, text, image });
        return { data: post };
    } catch (error) {
        return { error: error.message };
    }
};

// 📌 Get all posts (with author and comment authors populated)
const getPosts = async () => {
    try {
        const posts = await Post.find()
            .populate('user', 'name avatar bio') // post author
            .populate('comments.user', 'name') // commenter names ✅
            .sort({ createdAt: -1 });

        return { data: posts };
    } catch (error) {
        return { error: error.message };
    }
};

// 📌 Get posts by a specific user (with commenter names)
const getMyPosts = async (userId) => {
    try {
        const posts = await Post.find({ user: userId })
            .populate('user', 'name')
            .populate('comments.user', 'name')
            .sort({ createdAt: -1 });

        return { data: posts };
    } catch (error) {
        return { error: error.message };
    }
};

// ✅ Like a post (with populated user/comment user)
const likePost = async (postId, userId) => {
    try {
        const post = await Post.findById(postId);
        if (!post) return { error: 'Post not found' };

        if (!post.likes.includes(userId)) {
            post.likes.push(userId);
            await post.save();
        }

        const updatedPost = await Post.findById(postId)
            .populate('user', 'name')
            .populate('comments.user', 'name');

        return { data: updatedPost };
    } catch (error) {
        return { error: error.message };
    }
};

// ✅ Unlike a post (with populated user/comment user)
const unlikePost = async (postId, userId) => {
    try {
        const post = await Post.findById(postId);
        if (!post) return { error: 'Post not found' };

        post.likes = post.likes.filter(id => id.toString() !== userId);
        await post.save();

        const updatedPost = await Post.findById(postId)
            .populate('user', 'name')
            .populate('comments.user', 'name');

        return { data: updatedPost };
    } catch (error) {
        return { error: error.message };
    }
};

// 💬 Add a comment to a post
const addComment = async (postId, userId, commentText) => {
    try {
        const post = await Post.findById(postId);
        if (!post) return { error: 'Post not found' };

        const comment = {
            user: userId,
            text: commentText,
            createdAt: new Date()
        };

        post.comments.push(comment);
        await post.save();

        // 🔁 Refetch with populated commenter info
        const updatedPost = await Post.findById(postId)
            .populate('user', 'name')
            .populate('comments.user', 'name');

        return { data: updatedPost };
    } catch (error) {
        return { error: error.message };
    }
};

// 🗑️ Delete a post
const deletePost = async (postId, userId) => {
    try {
        const post = await Post.findById(postId);
        if (!post) return { error: 'Post not found' };

        if (post.user.toString() !== userId) {
            return { error: 'Unauthorized to delete this post' };
        }

        await post.deleteOne();
        return { data: 'Post deleted successfully' };
    } catch (error) {
        return { error: error.message };
    }
};

// 📌 Get single post by ID
const getPostById = async (postId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(postId)) return null;

        const post = await Post.findById(postId)
            .populate('user', 'name avatar')
            .populate('comments.user', 'name avatar');

        return post;
    } catch (err) {
        console.error('getPostById error:', err.message);
        throw err;
    }
};

module.exports = {
    createPost,
    getPosts,
    getMyPosts,
    likePost,
    unlikePost,
    addComment,
    deletePost,
    getPostById
};
