import React, { useState, useRef, useEffect } from 'react';
import './chatbot.css';

const Userchat = () => {
  
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Chat started.' },
  ]);

  
  const [currentSender, setCurrentSender] = useState('user');

  
  const [input, setInput] = useState('');

  const messagesEndRef = useRef(null);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    
    setMessages((prev) => [...prev, { sender: currentSender, text: input }]);

    setInput('');
    
    setCurrentSender(currentSender === 'user' ? 'admin' : 'user');
  };


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chatbot-container" style={{ maxWidth: '400px', margin: 'auto' }}>
      <div className="chatbot-header">User & Admin Chat Simulator</div>
      <div className="chatbot-messages" style={{ minHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={
              msg.sender === 'bot'
                ? 'chatbot-bot-msg'
                : msg.sender === 'user'
                ? 'chatbot-user-msg'
                : 'chatbot-admin-msg'
            }
            style={{ marginBottom: '10px' }}
          >
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="chatbot-input" onSubmit={sendMessage} style={{ marginTop: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message as ${currentSender}...`}
          style={{ width: '70%', padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 12px', marginLeft: '5px' }}>
          Send
        </button>
      </form>
      <div style={{ marginTop: '5px', fontSize: '12px', color: '#555' }}>
        Current sender: <strong>{currentSender.toUpperCase()}</strong>
      </div>
    </div>
  );
};

export default Userchat;
