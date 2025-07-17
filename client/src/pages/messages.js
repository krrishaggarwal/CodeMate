import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/socketContext';
import '../styles/messages.css';
// ... imports remain unchanged

const Messages = () => {
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext)?.current;

  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Fetch sidebar chat list
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/messages/conversations?userId=${user?.userId}`
        );
        const data = await res.json();
        if (res.ok) {
          setConversations(data);
          setError('');
        } else {
          setError('Could not fetch conversations.');
        }
      } catch (err) {
        setError('Network error.');
        console.error('Fetch conversations error:', err);
      }
    };

    //if (user?.userId) {
      fetchConversations();
    //}
  }, [user]);

  // Fetch messages when a user is selected
  const fetchMessages = async (otherUserId, otherUserName) => {
    setSelectedUser(otherUserId);
    setSelectedUserName(otherUserName);
    try {
      const res = await fetch(
        `http://localhost:5000/api/messages/${user?.userId}/${otherUserId}`
      );
      const data = await res.json();
      if (res.ok) {
        setMessages(data);
        setError('');
      } else {
        setMessages([]);
        setError('Could not fetch messages.');
      }
    } catch (err) {
      console.error('Fetch messages error:', err);
      setMessages([]);
      setError('Network error while fetching messages.');
    }
  };

  // ✅ FIXED sendMessage
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || isSending) return;
    setIsSending(true);
    try {
      const res = await fetch('http://localhost:5000/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.userId,
          receiverId: selectedUser,
          content: newMessage
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || 'Failed to send message');
      }

      const formattedMessage = {
        _id: result._id,
        content: result.content,
        sender: result.sender || { _id: user.userId, name: user.name },
        timestamp: result.timestamp || new Date().toISOString()
      };

      setMessages((prev) => [...prev, formattedMessage]);
      setNewMessage('');

      if (socket) {
        socket.emit('send_message', {
          ...formattedMessage,
          receiverId: selectedUser
        });
      }

      setError('');
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  // Listen for incoming socket messages
  useEffect(() => {
    if (!socket) return;

    const handleReceive = (msg) => {
      if (msg.senderId === selectedUser || msg.sender?._id === selectedUser) {
        setMessages((prev) => [...prev, {
          ...msg,
          sender: msg.sender || { _id: msg.senderId, name: selectedUserName }
        }]);
      }
    };

    socket.on('receive_message', handleReceive);

    return () => {
      socket.off('receive_message', handleReceive);
    };
  }, [socket, selectedUser, selectedUserName]);

  return (
    <div className="messages-container">
      <div className="sidebar">
        <h2>Chats</h2>
        {error && <p className="error">{error}</p>}
        <ul>
          {conversations.map((conv) => (
            <li
              key={conv._id}
              onClick={() => fetchMessages(conv._id, conv.name)}
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
            <div className="chat-header">
              <h3>{selectedUserName}</h3>
            </div>

            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={msg._id || index}
                  className={`message-bubble ${(msg.sender?._id || msg.sender) === user.userId ? 'sent' : 'received'
                    }`}
                >
                  <div className="message-content">{msg.content}</div>
                  <div className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="chat-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                disabled={isSending}
              />
              <button
                onClick={sendMessage}
                disabled={isSending || !newMessage.trim()}
              >
                {isSending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </>
        ) : (
          <div className="no-chat">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
