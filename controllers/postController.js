const Post = require('../models/post');

// Create Post
function createPost(userId, text, image) {
    return Post.create({
        user: userId,
        text: text,
        image: image, // optional
    })
    .then(post => {
        return { data: post };
    })
    .catch(error => {
        return { error: error.message };
    });
}

// Show random posts (for homepage)
function getPosts() {
    return Post.find()
        .populate('user', 'name')
        .then(posts => {
            return { data: posts };
        })
        .catch(error => {
            return { error: error.message };
        });
}

// Get my posts
function getMyPosts(userId) {
    return Post.find({ user: userId })
        .then(posts => {
            return { data: posts };
        })
        .catch(error => {
            return { error: error.message };
        });
}

// Like a post
function likePost(postId, userId) {
    return Post.findById(postId)
        .then(post => {
            if (!post) return { error: 'Post not found' };

            if (!post.likes.includes(userId)) {
                post.likes.push(userId);
                return post.save().then(updatedPost => {
                    return { data: updatedPost };
                });
            }

            return { data: post }; // Already liked
        })
        .catch(error => {
            return { error: error.message };
        });
}

// Unlike a post
function unlikePost(postId, userId) {
    return Post.findById(postId)
        .then(post => {
            if (!post) return { error: 'Post not found' };

            post.likes = post.likes.filter(id => id.toString() !== userId);
            return post.save().then(updatedPost => {
                return { data: updatedPost };
            });
        })
        .catch(error => {
            return { error: error.message };
        });
}

// Add comment to a post
function addComment(postId, userId, commentText) {
    return Post.findById(postId)
        .then(post => {
            if (!post) return { error: 'Post not found' };

            const comment = {
                user: userId,
                text: commentText,
                createdAt: new Date()
            };

            post.comments.push(comment);
            return post.save().then(updatedPost => {
                return { data: updatedPost };
            });
        })
        .catch(error => {
            return { error: error.message };
        });
}

module.exports = {
    createPost,
    getPosts,
    getMyPosts,
    likePost,
    unlikePost,
    addComment
};
