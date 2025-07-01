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

// show random Posts (for homepage)
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

module.exports = { createPost, getPosts, getMyPosts };