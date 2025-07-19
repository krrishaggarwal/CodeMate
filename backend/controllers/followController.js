const Post = require('../models/post');
const FollowRequest = require('../models/followRequest');

// 🟢 Send follow request
const sendFollowRequest = async (fromUserId, toUserId) => {
  try {
    if (fromUserId === toUserId) {
      return { error: 'You cannot follow yourself' };
    }

    const existingRequest = await FollowRequest.findOne({
      from: fromUserId,
      to: toUserId,
      status: 'pending'
    });

    if (existingRequest) {
      return { error: 'Follow request already sent' };
    }

    const followRequest = await FollowRequest.create({
      from: fromUserId,
      to: toUserId
    });

    return { data: followRequest };
  } catch (error) {
    return { error: error.message };
  }
};

// 🔁 Accept or decline follow request
const respondFollowRequest = async (requestId, userId, status) => {
  try {
    if (!['accepted', 'declined'].includes(status)) {
      return { error: 'Invalid status value' };
    }

    const followRequest = await FollowRequest.findById(requestId);
    if (!followRequest) return { error: 'Follow request not found' };

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

// 📥 Get follow requests (UPDATED to return requester object)
const getMyFollowRequests = async (userId) => {
  try {
    const requests = await FollowRequest.find({ to: userId, status: 'pending' })
      .populate('from', 'name email avatar')
      .lean();

    const formatted = requests.map(req => ({
      _id: req._id,
      requester: req.from
    }));

    return { data: formatted };
  } catch (error) {
    return { error: error.message };
  }
};

// ✅ Check follow status between two users
const checkFollowStatus = async (req, res) => {
  try {
    const fromUserId = req.query.from;
    const toUserId = req.params.id;

    const existing = await FollowRequest.findOne({
      from: fromUserId,
      to: toUserId,
      status: 'accepted'
    });

    res.status(200).json({ isFollowing: !!existing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendFollowRequest,
  respondFollowRequest,
  getMyFollowRequests,
  checkFollowStatus
};