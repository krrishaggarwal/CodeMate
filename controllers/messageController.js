const Message = require('../models/message');

// Send msg
const sendMessage = async (fromUserId, toUserId, text) => {
    try {
        const message = await Message.create({
            sender: fromUserId,
            receiver: toUserId,
            content: text,
        });
        return { data: message };
    } catch (error) {
        return { error: error.message };
    }
};

// Return/display msg
const getMessages = async (userId1, userId2) => {
    try {
        const messages = await Message.find({
            $or: [
                { from: userId1, to: userId2 },
                { from: userId2, to: userId1 }
            ]
        }).sort('createdAt');
        return { data: messages };
    } catch (error) {
        return { error: error.message };
    }
};

module.exports = { sendMessage, getMessages };