// Importing mongoose
const mongoose = require('mongoose');

// Creating the Comment schema
const CommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: [300, 'Comment cannot exceed 300 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Creating the Post schema
const PostSchema = new mongoose.Schema({
    // Reference to the user who created the post
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'], // Must link to a user
    },

    // Post text content
    text: {
        type: String,
        required: [true, 'Post text is required'], // Cannot be empty
        trim: true,
        minlength: [1, 'Post must have at least 1 character'],
        maxlength: [500, 'Post cannot exceed 500 characters']
    },

    // Optional image URL for the post
    image: {
        type: String,
        default: '', // Default to empty string if not provided
        match: [
            /^$|^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i,
            'Invalid image URL format'
        ]
    },

    // Likes: array of user IDs
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    // Comments: array of comment objects
    comments: [CommentSchema],

    // Timestamp when the post was created
    createdAt: {
        type: Date,
        default: Date.now // Automatically set to current date/time
    }
});

// Exporting the Post model
module.exports = mongoose.model('Post', PostSchema);