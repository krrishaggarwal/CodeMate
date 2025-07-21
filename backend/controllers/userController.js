const User = require("../models/user");
const Post = require("../models/post");
const FollowRequest = require("../models/followRequest");
const Message = require("../models/message");
const { exportUserProfileToPDF } = require("../utils/pdfExporter");

//Get user profile
const getProfile = async (userId) => {
    try {
        const user = await User.findById(userId).select('-password');
        return { data: user };
    } catch (error) {
        return { error: error.message };
    }
};

//Update user profile
const updateProfile = async (userId, updates) => {
    try {
        const user = await User.findById(userId);
        if (!user) return { error: 'User not found' };

        user.name = updates.name || user.name;
        user.skills = updates.skills || user.skills;
        user.bio = updates.bio || user.bio;
        user.github = updates.github || user.github;
        user.linkedin = updates.linkedin || user.linkedin;
        user.website = updates.website || user.website;
        user.location = updates.location || user.location;
        user.avatar = updates.avatar || user.avatar;

        // ✅ Merge incoming projects with existing ones (preserve old ones)
        if (Array.isArray(updates.projects)) {
            const incomingIds = updates.projects.map(p => p.id);
            const remainingOldProjects = user.projects.filter(p => !incomingIds.includes(p.id));
            user.projects = [...remainingOldProjects, ...updates.projects];
        }

        await user.save();
        const updatedUser = await User.findById(userId).select('-password');
        return { data: updatedUser };

    } catch (error) {
        return { error: error.message };
    }
};


//Search users by keyword
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

//user stats - followers, following, posts
const getUserStats = async (req, res) => {
    try {
        const userId = req.params.id;

        const followers = await FollowRequest.countDocuments({
            to: userId,
            status: 'accepted'
        });

        const following = await FollowRequest.countDocuments({
            from: userId,
            status: 'accepted'
        });

        const totalPosts = await Post.countDocuments({ userId });

        res.status(200).json({
            followers,
            following,
            totalPosts,
            profileViews: 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Download profile as PDF
const downloadUserProfilePDF = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });

        const filePath = await exportUserProfileToPDF(user, `${user.name}-Profile.pdf`);
        res.download(filePath);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    searchUsers,
    downloadUserProfilePDF,
    getUserStats
};
