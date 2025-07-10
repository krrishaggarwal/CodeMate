/* this model defines the schema for the the user which collect various details of the user with some validations*/
const mongoose = require("mongoose");

// Define the User schema
const UserSchema = new mongoose.Schema({
    // User's full name
    name: {
        type: String,
        required: [true, "Required"],       // Must be provided
        trim: true,                         // Removes extra spaces
        minlength: [2, "min 2 characters"], // Min length
        maxlength: [50, "max 50 characters"]   // Max length
    },

    // User's email address
    email: {
        type: String,
        required: [true, "Required"],      // Must be provided
        unique: true,                               // Must be unique in the database
        trim: true,                                 // Clean up spaces
        lowercase: true,                            // Converts to lowercase
        match: [/\S+@\S+\.\S+/, "Invalid Email"]  // Must follow email pattern
    },

    // User's password (should be hashed)
    password: {
        type: String,
        required: [true, "Required"],   // Must be provided
        minlength: [6, "min 6 characters"] // Min length
    },

    // User's short bio (optional)
    bio: {
        type: String,
        maxlength: [200, "Max 200 characters"] // Max length
    },

    // List of technical skills
    skills: {
        type: [String]                              // Array of strings
    },

    // GitHub profile URL
    github: {
        type: String
    },

    // LinkedIn profile URL
    linkedin: {
        type: String
    },

    // List of users following this user
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // List of users this user is following
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // Account creation date
    createdAt: {
        type: Date,
        default: Date.now // Set current time automatically
    }
});

// Export the model to use in other files
module.exports = mongoose.model("User", UserSchema);