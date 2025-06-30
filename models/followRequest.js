// Import mongoose to define the schema
const mongoose = require('mongoose');

// Define the schema for follow requests between users
const FollowRequestSchema = new mongoose.Schema({
    // stores the User_id as reference from User schema
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // also stores the User_id as reference from User schema    
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // show the status of request accepted/rejected or still pending
    status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
    requestedAt: { type: Date, default: Date.now }  // store the time when the request was sent
});

// exporting followRequest model
module.exports = mongoose.model('FollowRequest', FollowRequestSchema);