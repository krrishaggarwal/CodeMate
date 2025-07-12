import React, { useState } from 'react';
import '../styles/chatBox.css';

const ChatBox = () => {
  const [messages, setMessages] = useState([
    { from: 'other', text: 'Hey! How are you?' },
    { from: 'me', text: 'I am good, thanks! What about you?' },
    { from: 'other', text: 'Doing great, just working on some React stuff.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { from: 'me', text: input }]);
      setInput('');
    }
  };

  return (
    <div className="chatbox-container">
      <div className="chatbox-messages">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`chat-message ${msg.from === 'me' ? 'sent' : 'received'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chatbox-input">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
