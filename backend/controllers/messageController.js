const Message = require('../models/message');

const sendMessage = async (senderId, receiverId, content) => {
    try {
        const message = new Message({
            sender: senderId,
            receiver: receiverId,
            content: content
        });

        await message.save();
        await message.populate('sender', '_id name');

        return {
            success: true,
            data: {
                _id: message._id,
                content: message.content,
                sender: message.sender,
                timestamp: message.timestamp.toISOString()
            }
        };
    } catch (error) {
        console.error('Error in sendMessage:', error);
        return {
            success: false,
            error: 'Failed to send message',
            details: error.message
        };
    }
};



const getMessages = async (userId1, userId2) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: userId1, receiver: userId2 },
                { sender: userId2, receiver: userId1 }
            ]
        })
            .populate("sender", "_id name")
            .sort({ timestamp: 1 }); // Sort by createdAt ascending

        // Format dates consistently
        const formattedMessages = messages.map(msg => ({
            ...msg.toObject(),
            timestamp: msg.timestamp.toISOString()
        }));

        return { data: formattedMessages };
    } catch (error) {
        return { error: error.message };
    }
};

module.exports = { sendMessage, getMessages };