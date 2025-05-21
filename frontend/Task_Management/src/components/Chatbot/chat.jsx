import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './chatbot.css';

const socket = io('http://localhost:5000');

const chat = ({ sender }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('chat-history', (history) => {
      setMessages(history);
    });

    socket.on('receive-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('chat-history');
      socket.off('receive-message');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const msg = { sender, text: input, timestamp: Date.now() };
    socket.emit('send-message', msg);
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">{sender} Chat</div>
      <div className="chatbot-messages" style={{height: '300px', overflowY: 'auto'}}>
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
          >
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="chatbot-input" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default chat;
