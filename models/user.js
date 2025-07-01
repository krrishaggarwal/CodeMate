// Importing mongoose module
const mongoose = require('mongoose');

// Creating User schema
const UserSchema = new mongoose.Schema({
    // We don't add custom u_id because MongoDB automatically adds a unique _id for each user
    name: String,   // User's name
    email: { type: String, unique: true },  // Unique email address
    password: String,   // Hashed password
    bio: String,    // Short bio or description
    skills: [String],   // List of user's technical skills
    github: String,     // GitHub profile URL or username
    linkedIn: String,     // LinkedIn profile URL or username
    // Follower system - storing MongoDB ObjectId references to other users
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // Timestamp when user account is created
    createdAt: { type: Date, default: Date.now }
});

// Exporting the model
module.exports = mongoose.model('User', UserSchema);
