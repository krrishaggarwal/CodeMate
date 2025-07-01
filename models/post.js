// Importing mongoose
const mongoose = require('mongoose');

// Creating the Post schema
const PostSchema = new mongoose.Schema({
    // Reference to the user who created the post
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },   // Post text content 
    image: { type: String, default: '' },     // Post image URL
    createdAt: { type: Date, default: Date.now }    // Timestamp when the post was created
});

// Exporting the Post model
module.exports = mongoose.model('Post', PostSchema);