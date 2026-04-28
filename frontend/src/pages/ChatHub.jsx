import React, { useState } from 'react';
import ChatList from '../components/ChatList';
import Chat from './Chat';

const ChatHub = ({ userEmail }) => {
  const [selectedChatId, setSelectedChatId] = useState(null);

  // If no chat is selected, show the Messenger list
  if (!selectedChatId) {
    return (
      <div className="chat-hub-container">
        <div className="chat-hub-header">
          <h2>Messages</h2>
        </div>
        <ChatList onSelectChat={(id) => setSelectedChatId(id)} />
      </div>
    );
  }

  // If AI BUDDY (or any ID) is selected, show the actual Chat interface
  return (
    <Chat 
      userName={userEmail} 
      onBack={() => setSelectedChatId(null)} 
    />
  );
};

export default ChatHub;