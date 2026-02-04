// Chat routes - handles message sending and history
const express = require('express');
const axios = require('axios');
const { db } = require('../config/firebase');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// System prompt for Bible AI
const BIBLE_SYSTEM_PROMPT = `You are a wise and compassionate Bible teacher. Your purpose is to help people understand and apply God's Word.

INSTRUCTIONS:
1. Answer ALL questions strictly from the Bible and biblical knowledge
2. Always quote scripture references (Book Chapter:Verse) when relevant
3. Provide multiple relevant verses when applicable
4. Maintain a tone of love, wisdom, and humility
5. Avoid denominational bias - stay focused on Scripture itself
6. If you're uncertain about how Scripture addresses a question, respond with: "Let us search the scriptures"
7. Help people connect biblical truths to their lives
8. Pray for wisdom in your responses

Remember: Your foundation is Scripture alone. Always direct people back to God's Word.`;

// Send message to OpenAI and save to Firestore
router.post('/message', verifyToken, async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    if (userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Get user's chat history from Firestore
    const chatDocRef = db.collection('chats').doc(userId);
    const chatDoc = await chatDocRef.get();
    const chatMessages = chatDoc.exists ? chatDoc.data().messages || [] : [];

    // Format messages for OpenAI API
    const formattedMessages = [
      { role: 'system', content: BIBLE_SYSTEM_PROMPT },
      ...chatMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    // Call OpenAI Chat Completion API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiMessage = response.data.choices[0].message.content;

    // Save messages to Firestore
    const userMessageDoc = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    const aiMessageDoc = {
      role: 'assistant',
      content: aiMessage,
      timestamp: new Date().toISOString(),
    };

    await chatDocRef.set(
      {
        userId,
        messages: [...chatMessages, userMessageDoc, aiMessageDoc],
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // Return AI message to frontend
    res.json({
      message: aiMessage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error processing message:', error);

    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'OpenAI API key is invalid' });
    }

    res.status(500).json({
      error: 'Failed to process message. Please try again.',
      details: error.message,
    });
  }
});

// Get chat history for a user
router.get('/history/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user is accessing their own history
    if (userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const chatDoc = await db.collection('chats').doc(userId).get();

    if (!chatDoc.exists) {
      return res.json({ messages: [] });
    }

    res.json(chatDoc.data());
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

module.exports = router;
