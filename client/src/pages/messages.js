import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useSocket } from '../context/socketContext';
import '../styles/messages.css';

const Messages = () => {
  const { user } = useContext(AuthContext);
  const socket = useSocket();

  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch list of conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/messages/conversations`);
        const data = await res.json();
        if (res.ok) setConversations(data);
        else setError('Could not fetch conversations.');
      } catch {
        setError('Network error.');
      }
    };

    fetchConversations();
  }, []);

  // Fetch chat history with selected user
  const fetchMessages = async (otherUserId) => {
    setSelectedUser(otherUserId);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/messages/${otherUserId}`);
      const data = await res.json();
      if (res.ok) setMessages(data);
      else setMessages([]);
    } catch {
      setMessages([]);
    }

    // Join socket room
    if (socket) {
      socket.emit('joinRoom', getRoomId(user._id, otherUserId));
    }
  };

  // Socket listener for real-time messages
  useEffect(() => {
    if (!socket) return;

    socket.on('receiveMessage', (msg) => {
      if (msg.from === selectedUser || msg.to === selectedUser) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => socket.off('receiveMessage');
  }, [socket, selectedUser]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socket || !selectedUser) return;

    const messageData = {
      to: selectedUser,
      from: user._id,
      content: newMessage,
    };

    socket.emit('sendMessage', messageData);
    setMessages(prev => [...prev, messageData]);
    setNewMessage('');
  };

  const getRoomId = (id1, id2) => {
    return [id1, id2].sort().join('-');
  };

  return (
    <div className="messages-container">
      <div className="sidebar">
        <h2>Chats</h2>
        {error && <p className="error">{error}</p>}
        <ul>
          {conversations.map((conv) => (
            <li
              key={conv._id}
              onClick={() => fetchMessages(conv._id)}
              className={selectedUser === conv._id ? 'active' : ''}
            >
              {conv.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-window">
        {selectedUser ? (
          <>
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message-bubble ${msg.from === user._id ? 'sent' : 'received'}`}
                >
                  {msg.content}
                </div>
              ))}
            </div>

            <div className="chat-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="no-chat">Select a conversation to start messaging.</div>
        )}
      </div>
    </div>
  );
};

export default Messages;
