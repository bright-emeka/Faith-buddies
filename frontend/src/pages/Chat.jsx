import React, { useState, useEffect, useRef } from 'react';
import { sendMessage, getChatHistory, setAuthToken } from '../services/api';
import { auth } from '../services/firebase';

// Removed userName from the props if you aren't using it inside the component
// Changed catch(error) to catch(err) and added a console.log to clear the error
const Chat = ({ onBack }) => { 
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          setAuthToken(token);
          const history = await getChatHistory(user.uid);
          setMessages(history.messages || []);
        }
      } catch (err) {
        // Logging 'err' prevents the "defined but never used" error
        console.error('Initialization error:', err);
      }
    };
    initChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const user = auth.currentUser;
    if (!user) return;

    const userMessage = { 
      role: 'user', 
      content: input, 
      timestamp: new Date().toISOString() 
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendMessage(input, user.uid);
      const aiMessage = { 
        role: 'assistant', 
        content: response.message, 
        timestamp: new Date().toISOString() 
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      // Logging 'err' here as well to satisfy the linter
      console.error('Message error:', err);
      setMessages((prev) => [
        ...prev, 
        { 
          role: 'assistant', 
          content: 'Sorry, I hit a snag. Please try again.', 
          timestamp: new Date().toISOString() 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-interface-wrapper">
      <div className="chat-active-header">
        {/* The onBack here links to setSelectedChatId(null) in ChatHub */}
        <button onClick={onBack} className="back-arrow" type="button">←</button>
        <div className="header-user-info">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" 
            alt="AI" 
            className="small-avatar" 
          />
          <span>AI BUDDY</span>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message-bubble ${msg.role === 'user' ? 'user' : 'ai'}`}>
             <div className="text-content">{msg.content}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={loading}
        />
        <button type="submit" className="send-icon-btn" disabled={loading || !input.trim()}>
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chat;