const Message = require('../models/message');

// Send message
function sendMessage(fromUserId, toUserId, text) {
    return Message.create({
        sender: fromUserId,
        receiver: toUserId,
        content: text
    })
    .then(message => {
        return { data: message };
    })
    .catch(error => {
        return { error: error.message };
    });
}

// Get/display messages between two users
function getMessages(userId1, userId2) {
    return Message.find({
        $or: [
            { sender: userId1, receiver: userId2 },
            { sender: userId2, receiver: userId1 }
        ]
    })
    .sort('createdAt')
    .then(messages => {
        return { data: messages };
    })
    .catch(error => {
        return { error: error.message };
    });
}

module.exports = {
    sendMessage,
    getMessages
};
