const Post = require('../models/post');
const FollowRequest = require('../models/followRequest');

// Send a follow request
const sendFollowRequest = async (fromUserId, toUserId) => {
    try {
        if (fromUserId === toUserId) {
            return { error: 'You cannot follow yourself' };
        }

        // Check if a pending request already exists
        const existingRequest = await FollowRequest.findOne({
            from: fromUserId,
            to: toUserId,
            status: 'pending',
        });

        if (existingRequest) {
            return { error: 'Follow request already sent' };
        }

        const followRequest = await FollowRequest.create({
            from: fromUserId,
            to: toUserId,
        });

        return { data: followRequest };
    } catch (error) {
        return { error: error.message };
    }
};

// Accept or decline a follow request
const respondFollowRequest = async (requestId, userId, status) => {
    try {
        // Validate status input
        if (!['accepted', 'declined'].includes(status)) {
            return { error: 'Invalid status value' };
        }

        const followRequest = await FollowRequest.findById(requestId);
        if (!followRequest) {
            return { error: 'Follow request not found' };
        }

        // Only the receiver can respond
        if (followRequest.to.toString() !== userId) {
            return { error: 'Not authorized to respond to this request' };
        }

        followRequest.status = status;
        await followRequest.save();

        return { data: followRequest };
    } catch (error) {
        return { error: error.message };
    }
};

// Show follow requests sent to the logged-in user
const getMyFollowRequests = async (userId) => {
    try {
        const requests = await FollowRequest.find({ to: userId, status: 'pending' })
            .populate('from', 'name email');

        return { data: requests };
    } catch (error) {
        return { error: error.message };
    }
};

module.exports = { sendFollowRequest, respondFollowRequest, getMyFollowRequests };