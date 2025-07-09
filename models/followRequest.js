/* this model stores the data for follow requests */
const mongoose = require('mongoose');

// Define the schema for follow requests between users
const FollowRequestSchema = new mongoose.Schema({
    // Sender of the follow request (User ID)
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Sender user ID (from) is required']
    },

    // Receiver of the follow request (User ID)
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Receiver user ID (to) is required']
    },

    // Status of the follow request
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'], // Only these 3 values allowed
        default: 'pending',
        required: [true, 'Follow request status is required']
    },

    // Timestamp of when the request was created
    requestedAt: {
        type: Date,
        default: Date.now // Automatically sets the current time
    }
});

// Export the model to use it in controllers/routes
module.exports = mongoose.model('FollowRequest', FollowRequestSchema);
