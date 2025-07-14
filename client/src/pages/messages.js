import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/messages.css';

const Messages = () => {
  const { user, token } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/messages/conversations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) setConversations(data);
        else setError('Could not fetch conversations.');
      } catch {
        setError('Network error.');
      }
    };

    fetchConversations();
  }, [token]);

  const fetchMessages = async (otherUserId) => {
    setSelectedUser(otherUserId);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/messages/${otherUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) setMessages(data);
      else setMessages([]);
    } catch {
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ to: selectedUser, content: newMessage })
      });
      const data = await res.json();

      if (res.ok) {
        setMessages(prev => [...prev, data]);
        setNewMessage('');
      }
    } catch {}
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
