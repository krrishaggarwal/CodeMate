const User = require('../models/user');
const { exportUserProfileToPDF } = require('../utils/pdfExporter');

// Get logged-in user's profile
function getProfile(userId) {
    return User.findById(userId).select('-password')
        .then(user => {
            return { data: user };
        })
        .catch(error => {
            return { error: error.message };
        });
}

// Update profile
function updateProfile(userId, updates) {
    return User.findById(userId)
        .then(user => {
            if (!user) return { error: 'User not found' };

            user.name = updates.name || user.name;
            user.skills = updates.skills || user.skills;
            user.bio = updates.bio || user.bio;
            user.github = updates.github || user.github;
            user.linkedin = updates.linkedin || user.linkedin;

            return user.save()
                .then(updatedUser => {
                    return { data: updatedUser };
                });
        })
        .catch(error => {
            return { error: error.message };
        });
}

// Search users by keyword (name or email or skill)
function searchUsers(keyword) {
    return User.find({
        $or: [
            { name: { $regex: keyword, $options: 'i' } },
            { email: { $regex: keyword, $options: 'i' } },
            { skills: { $regex: keyword, $options: 'i' } }
        ]
    })
        .select('name email skills bio github linkedin')
        .then(users => {
            return { data: users };
        })
        .catch(error => {
            return { error: error.message };
        });
}

// Download user profile as PDF
function downloadUserProfilePDF(req, res) {
    User.findById(req.params.userId).select('-password')
        .then(user => {
            if (!user) return res.status(404).json({ error: 'User not found' });

            return exportUserProfileToPDF(user, `${user.name}-Profile.pdf`)
                .then(filePath => {
                    res.download(filePath);
                });
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
}

module.exports = {
    getProfile,
    updateProfile,
    searchUsers,
    downloadUserProfilePDF
};
