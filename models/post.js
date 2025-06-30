// Importing mongoose
const mongoose = require('mongoose');

// Creating the Post schema
const PostSchema = new mongoose.Schema({
    // Reference to the user who created the post
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,   // Post text content 
    image: String,  // Post image URL
    createdAt: { type: Date, default: Date.now }    // Timestamp when the post was created
});

// Exporting the Post model
module.exports = mongoose.model('Post', PostSchema);