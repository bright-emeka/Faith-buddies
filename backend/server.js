// Main Express server
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ES Module path fixes
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Routes
import chatRoutes from './routes/chat.js';
import usersRoutes from './routes/users.js';
import postsRoutes from './routes/posts.js';
import interactionsRoutes from './routes/interactions.js';
import followsRoutes from './routes/follows.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/interactions', interactionsRoutes);
app.use('/api/follows', followsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// --- SERVE FRONTEND (Monorepo Fix) ---
const currentDir = process.cwd();

// Detect root directory based on where the process was started
// If started from root (Render), currentDir is the root.
// If started from inside backend, go up one level.
const rootDir = currentDir.endsWith('backend') 
  ? path.join(currentDir, '..') 
  : currentDir;

const frontendPath = path.join(rootDir, 'frontend');
const distPath = path.join(frontendPath, 'dist'); 

if (fs.existsSync(distPath)) {
  console.log(`✅ Production Build Found: ${distPath}`);
  app.use(express.static(distPath));

  // Catch-all route to serve the React index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Graceful handling for local development vs production
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ ERROR: No frontend build folder found at:', distPath);
  } else {
    console.log('ℹ️ Local Dev: API active. Frontend handled by Vite on port 3000.');
  }
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(error.status || 500).json({
    error: error.message || 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Bible Social API active on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
});