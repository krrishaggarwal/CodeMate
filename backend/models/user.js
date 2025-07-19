const mongoose = require('mongoose');

// Define the Project schema (embedded in User)
const ProjectSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  technologies: {
    type: [String],
    default: []
  },
  github: {
    type: String,
    match: [/^https?:\/\/(www\.)?github\.com\/.+/, 'Invalid GitHub URL']
  },
  live: {
    type: String,
    match: [/^https?:\/\/.+/, 'Invalid Live URL']
  }
}, { _id: false }); // Prevents auto-generating _id for each project

// Define the User schema
const UserSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Email is invalid']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },

  // Optional Profile Info
  bio: {
    type: String,
    maxlength: [200, 'Bio cannot exceed 200 characters']
  },
  skills: {
    type: [String],
    default: []
  },
  location: {
    type: String,
    trim: true,
    maxlength: 100
  },
  website: {
    type: String,
    match: [/^https?:\/\/.+/, 'Invalid Website URL']
  },
  github: {
    type: String,
    match: [/^https?:\/\/(www\.)?github\.com\/.+/, 'Invalid GitHub URL']
  },
  linkedin: {
    type: String,
    match: [/^https?:\/\/(www\.)?linkedin\.com\/.+/, 'Invalid LinkedIn URL']
  },
  avatar: {
    type: String, // Image URL
    match: [/^https?:\/\/.+/, 'Invalid Avatar URL']
  },

  // Social Graph
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],

  // Projects
  projects: {
    type: [ProjectSchema],
    default: []
  },

  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Export the model
module.exports = mongoose.model('User', UserSchema);