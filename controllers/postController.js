const Post = require('../models/post');

// Create Post
const createPost = async (userId, text, image) => {
    try {
        const post = await Post.create({
            user: userId,
            text: text,
            image: image, // optional
        });
        return { data: post };
    } catch (error) {
        return { error: error.message };
    }
};

// Show random Posts (for homepage)
const getPosts = async () => {
    try {
        const posts = await Post.find().populate('user', 'name');
        return { data: posts };
    } catch (error) {
        return { error: error.message };
    }
};

// Get my posts
const getMyPosts = async (userId) => {
    try {
        const posts = await Post.find({ user: userId });
        return { data: posts };
    } catch (error) {
        return { error: error.message };
    }
};

// Like a post
const likePost = async (postId, userId) => {
    try {
        const post = await Post.findById(postId);
        if (!post) return { error: 'Post not found' };

        if (!post.likes.includes(userId)) {
            post.likes.push(userId);
            await post.save();
        }

        return { data: post };
    } catch (error) {
        return { error: error.message };
    }
};

// Unlike a post
const unlikePost = async (postId, userId) => {
    try {
        const post = await Post.findById(postId);
        if (!post) return { error: 'Post not found' };

        post.likes = post.likes.filter(id => id.toString() !== userId);
        await post.save();

        return { data: post };
    } catch (error) {
        return { error: error.message };
    }
};

// Add comment to a post
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

        return { data: post };
    } catch (error) {
        return { error: error.message };
    }
};

module.exports = {
    createPost,
    getPosts,
    getMyPosts,
    likePost,
    unlikePost,
    addComment
};
