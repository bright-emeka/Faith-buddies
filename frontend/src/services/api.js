// API service for backend communication
import axios from 'axios';

// Create axios instance pointing to backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Send message to AI chat
export const sendMessage = async (message, userId) => {
  try {
    const response = await api.post('/api/chat/message', {
      message,
      userId,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Get chat history for user
export const getChatHistory = async (userId) => {
  try {
    const response = await api.get(`/api/chat/history/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};

export default api;
