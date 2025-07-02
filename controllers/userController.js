const User = require('../models/user');

// Get logged-in user's profile
const getProfile = async (userId) => {
    try {
        const user = await User.findById(userId).select('-password');
        return { data: user };
    } catch (error) {
        return { error: error.message };
    }
};

// Update profile
const updateProfile = async (userId, updates) => {
    try {
        const user = await User.findById(userId);
        if (!user) return { error: 'User not found' };

        user.name = updates.name || user.name;
        user.skills = updates.skills || user.skills;
        user.bio = updates.bio || user.bio;
        user.github = updates.github || user.github;
        user.linkedin = updates.linkedin || user.linkedin;

        const updatedUser = await user.save();
        return { data: updatedUser };
    } catch (error) {
        return { error: error.message };
    }
};

// Search users by keyword (name or email or skill)
const searchUsers = async (keyword) => {
    try {
        const users = await User.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { email: { $regex: keyword, $options: 'i' } },
                { skills: { $regex: keyword, $options: 'i' } }
            ]
        }).select('name email skills bio github linkedin');

        return { data: users };
    } catch (error) {
        return { error: error.message };
    }
};


module.exports = {
    getProfile, updateProfile, searchUsers
};

