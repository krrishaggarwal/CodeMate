// Importing mongoose to define schema and interact with MongoDB
const mongoose = require('mongoose');

// Creating a new schema for storing chat messages
const MessageSchema = new mongoose.Schema({
    // This will store MongoDB ObjectId refers to the User schema
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // This will store MongoDB ObjectId refers to the User schema
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // The actual message content (text only)
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }    // timestamp is just a virable to show the time when the message was sent we can use createdAt also 
});

// Exporting the Message model
module.exports = mongoose.model('Message', MessageSchema);
