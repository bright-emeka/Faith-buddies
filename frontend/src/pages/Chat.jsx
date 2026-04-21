// Chat page component - AI Bible Chat interface
import React, { useState, useEffect, useRef } from 'react';
import { sendMessage, getChatHistory, setAuthToken } from '../services/api';
import { auth } from '../services/firebase';

const Chat = ({ userName }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize auth token and load chat history on component mount
  useEffect(() => {
    const initChat = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          setAuthToken(token);

          // Load chat history
          const history = await getChatHistory(user.uid);
          setMessages(history.messages || []);
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initChat();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim() || loading) return;

    const user = auth.currentUser;
    if (!user) {
      alert('User not authenticated');
      return;
    }

    // Add user message to UI immediately
    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Send message to backend
      const response = await sendMessage(input, user.uid);

      // Add AI response to UI
      const aiMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-chat">
            <h2>Welcome to Faith Friend</h2>
            <p>Ask me anything about your faith. I'll answer from sacred scriptures.</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-badge">
              {msg.role === 'user' ? '👤' : '📖'}
            </div>
            <div className="message-content">
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your faith..."
          disabled={loading}
          className="chat-input"
        />
        <button type="submit" disabled={loading} className="send-btn">
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chat;
