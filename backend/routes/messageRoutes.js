const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Message = require('../models/message');
const {
  sendMessage,
  getMessages
} = require('../controllers/messageController');

// 📤 Send a message
// POST /api/messages/send
router.post('/send', async (req, res) => {
  try {
    const fromUserId = req.body.fromUserId || req.body.senderId;
    const toUserId = req.body.toUserId || req.body.receiverId;
    const text = req.body.text || req.body.content;

    const result = await sendMessage(fromUserId, toUserId, text);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.status(200).json(result.data);
  } catch (error) {
    console.error('Unexpected error in route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// 📥 Get all messages between two users
// GET /api/messages/:userId1/:userId2
router.get('/:userId1/:userId2', async (req, res) => {
  const { userId1, userId2 } = req.params;

  const result = await getMessages(userId1, userId2);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  res.json(result.data);
});

// GET /api/messages/conversations
router.get('/conversations', async (req, res) => {
  const userId = req.query.userId;
  try {
    const users = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(userId) },
            { receiver: new mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      {
        $project: {
          user: {
            $cond: [
              { $eq: ['$sender', new mongoose.Types.ObjectId(userId)] },
              '$receiver',
              '$sender',
            ],
          },
        },
      },
      {
        $group: {
          _id: '$user',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      { $unwind: '$userInfo' },
      {
        $project: {
          _id: '$userInfo._id',
          name: '$userInfo.name',
        },
      },
    ]);

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Could not load conversations' });
  }
});

module.exports = router;