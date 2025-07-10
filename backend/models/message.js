/* this model helps storing the data for messages */
const mongoose = require("mongoose");

// Creating a new schema for storing chat messages
const MessageSchema = new mongoose.Schema({
    // The sender's user ID (must exist in User collection)
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Required"] // Must be provided
    },

    // The receiver's user ID (must exist in User collection)
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Required"] // Must be provided
    },

    // The actual message content
    content: {
        type: String,
        required: [true, "Required"], // Cannot be empty
        trim: true,
        minlength: [1, "min 1 character"],
        maxlength: [1000, "max 1000 character"]
    },

    // Time the message was sent
    timestamp: {
        type: Date,
        default: Date.now // Automatically sets current time
    }
});

// Exporting the Message model
module.exports = mongoose.model('Message', MessageSchema);