const Post = require('../models/post');
const FollowRequest = require('../models/followRequest');

// Send a follow request
function sendFollowRequest(fromUserId, toUserId) {
    if (fromUserId === toUserId) {
        return Promise.resolve({ error: 'You cannot follow yourself' });
    }

    return FollowRequest.findOne({
        from: fromUserId,
        to: toUserId,
        status: 'pending',
    })
    .then(existingRequest => {
        if (existingRequest) {
            return { error: 'Follow request already sent' };
        }

        return FollowRequest.create({
            from: fromUserId,
            to: toUserId,
        })
        .then(followRequest => {
            return { data: followRequest };
        });
    })
    .catch(error => {
        return { error: error.message };
    });
}

// Accept or decline a follow request
function respondFollowRequest(requestId, userId, status) {
    if (!['accepted', 'declined'].includes(status)) {
        return Promise.resolve({ error: 'Invalid status value' });
    }

    return FollowRequest.findById(requestId)
        .then(followRequest => {
            if (!followRequest) {
                return { error: 'Follow request not found' };
            }

            if (followRequest.to.toString() !== userId) {
                return { error: 'Not authorized to respond to this request' };
            }

            followRequest.status = status;
            return followRequest.save().then(updatedRequest => {
                return { data: updatedRequest };
            });
        })
        .catch(error => {
            return { error: error.message };
        });
}

// Get my follow requests
function getMyFollowRequests(userId) {
    return FollowRequest.find({ to: userId, status: 'pending' })
        .populate('from', 'name email')
        .then(requests => {
            return { data: requests };
        })
        .catch(error => {
            return { error: error.message };
        });
}

module.exports = {
    sendFollowRequest,
    respondFollowRequest,
    getMyFollowRequests
};
