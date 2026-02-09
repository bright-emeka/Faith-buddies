# Bible Social - File Reference Guide

Quick reference for every file in the project.

---

## 📂 Root Directory Files

### Documentation
- **README.md** - Complete setup, usage, and API documentation (read first)
- **QUICK_START.md** - Get running in 15 minutes (start here)
- **FIREBASE_SETUP.md** - Step-by-step Firebase configuration
- **OPENAI_SETUP.md** - Step-by-step OpenAI API setup
- **PROJECT_SUMMARY.md** - Project overview and what you have

---

## 🎨 Frontend (`frontend/`)

### Configuration
- **package.json** - Dependencies and scripts
- **.env.example** - Environment variables template (copy to .env)
- **.gitignore** - Git ignore patterns

### Application Entry
- **public/index.html** - HTML root file (React mounts here)
- **src/index.js** - React entry point, mounts App to DOM
- **src/App.js** - Main app component, handles auth routing

### Pages (Full Screen Components)
- **src/pages/Login.js** - Sign up / Login page
  - Form handling for email, password, name
  - Firebase Auth integration
  - Toggle between signup and login modes
  
- **src/pages/Chat.js** - AI Bible Chat interface
  - Message display (user right, AI left)
  - Chat input form
  - Auto-scroll to latest messages
  - API integration for sending messages

### Reusable Components
- **src/components/Header.js** - Top navigation bar
  - App title and logo
  - User name display
  - Logout button

### Services (Business Logic)
- **src/services/firebase.js** - Firebase configuration
  - Initializes Firebase with config from .env
  - Exports auth and db instances
  - Connection setup for all Firebase services

- **src/services/auth.js** - Authentication functions
  - `signUp(email, password, name)` - Create new user
  - `signIn(email, password)` - Login existing user
  - `logOut()` - Sign out user
  - `onAuthChange(callback)` - Listen to auth state changes

- **src/services/api.js** - API client for backend communication
  - `setAuthToken(token)` - Add Bearer token to requests
  - `sendMessage(message, userId)` - Send chat message
  - `getChatHistory(userId)` - Load chat history

### Styling
- **src/styles/App.css** - All CSS styling
  - Global styles
  - Component styles
  - Responsive design
  - Theme colors (purple/blue gradient)

---

## 🔌 Backend (`backend/`)

### Configuration
- **package.json** - Node.js dependencies and scripts
- **.env.example** - Environment variables template
- **.gitignore** - Git ignore patterns
- **server.js** - Express app entry point

### Main Application
- **server.js** - Express server setup
  - CORS configuration
  - Middleware setup
  - Route registration
  - Error handling
  - Server startup on port 5000

### Configuration Files
- **config/firebase.js** - Firebase Admin SDK initialization
  - Initializes admin app with service account
  - Exports admin, db, auth instances
  - Used for backend access to Firestore

### Middleware
- **middleware/auth.js** - Authentication middleware
  - `verifyToken(req, res, next)` - Verify Firebase tokens
  - Extracts userId from token
  - Protects API routes

### API Routes
- **routes/chat.js** - Chat API endpoints
  - `POST /api/chat/message` - Send message to AI
    - Retrieves user's chat history
    - Calls OpenAI API with system prompt
    - Saves conversation to Firestore
    - Returns AI response
  
  - `GET /api/chat/history/:userId` - Get chat history
    - Returns all messages for user
    - Protected by auth middleware

---

## 🔐 Environment Variables

### Frontend (.env)
```
REACT_APP_FIREBASE_API_KEY           # Firebase API key
REACT_APP_FIREBASE_AUTH_DOMAIN       # Firebase domain
REACT_APP_FIREBASE_PROJECT_ID        # Firebase project ID
REACT_APP_FIREBASE_STORAGE_BUCKET    # Firebase storage bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID  # Firebase sender ID
REACT_APP_FIREBASE_APP_ID            # Firebase app ID
REACT_APP_API_URL                    # Backend URL (http://localhost:5000)
```

### Backend (.env)
```
FIREBASE_PROJECT_ID                  # Firebase project ID
FIREBASE_SERVICE_ACCOUNT_KEY         # Complete service account JSON
OPENAI_API_KEY                       # OpenAI API key (sk-...)
PORT                                 # Server port (default: 5000)
NODE_ENV                             # Environment (development/production)
FRONTEND_URL                         # Frontend URL for CORS
```

---

## 📊 Data Models in Firestore

### Users Collection (`/users/{uid}`)
```
{
  id: string,              // Firebase UID (document ID)
  name: string,            // User's full name
  email: string,           // User's email address
  createdAt: timestamp     // ISO string when account created
}
```

### Chats Collection (`/chats/{uid}`)
```
{
  userId: string,          // Document ID = userId
  messages: [              // Array of chat messages
    {
      role: string,        // "user" or "assistant"
      content: string,     // Message text
      timestamp: string    // ISO timestamp
    }
  ],
  updatedAt: timestamp     // ISO string of last activity
}
```

---

## 🔄 Application Flow

### 1. User Signup
```
Frontend: User enters email, password, name
→ auth.js: signUp() → Firebase
→ Firebase: Creates user + stores in Users collection
→ Frontend: Redirected to chat page
```

### 2. User Login
```
Frontend: User enters email, password
→ auth.js: signIn() → Firebase
→ Firebase: Authenticates user
→ App.js: onAuthChange() detects login
→ Frontend: Redirected to chat page
```

### 3. Send Message
```
Frontend: User types message and clicks Send
→ Chat.js: setLoading(true)
→ api.js: sendMessage() with auth token
→ Backend: /api/chat/message endpoint
→ Backend: Retrieves chat history from Firestore
→ Backend: Calls OpenAI API with system prompt
→ OpenAI: Returns AI response
→ Backend: Saves to Firestore + returns response
→ Frontend: Displays AI message, saves to state
```

### 4. Load Chat History
```
Frontend: Component mounts
→ Chat.js: useEffect() calls getChatHistory()
→ api.js: GET /api/chat/history/:userId
→ Backend: Retrieves messages from Firestore
→ Frontend: Displays all messages
```

### 5. Logout
```
Frontend: User clicks Logout
→ Header.js: logOut()
→ auth.js: signOut() → Firebase
→ App.js: onAuthChange() detects logout
→ Frontend: Redirected to login page
```

---

## 🛠️ File Responsibilities

| File | Responsibility | Lines |
|------|-----------------|-------|
| **Frontend** | | |
| App.js | Auth routing, user state | 45 |
| Login.js | Auth UI, form handling | 78 |
| Chat.js | Chat UI, message display | 96 |
| Header.js | Navigation, logout | 22 |
| firebase.js | Firebase config | 18 |
| auth.js | Auth functions | 48 |
| api.js | API communication | 37 |
| App.css | All styling | 420 |
| **Backend** | | |
| server.js | Express app setup | 39 |
| chat.js | Chat API routes | 109 |
| firebase.js | Firebase admin | 18 |
| auth.js | Token verification | 28 |
| **Total** | **~900 lines of code** | |

---

## 📝 Comments & Documentation

Every major function has comments explaining:
- What it does
- Parameters and return values
- Any important logic or side effects

Examples:
- `src/App.js` - Auth state management
- `src/pages/Chat.js` - Message handling flow
- `backend/routes/chat.js` - System prompt and API call

---

## 🚀 Running the Application

### Terminal 1 - Start Backend
```bash
cd backend
npm install
npm run dev
# Output: 🙏 Bible Social API running on http://localhost:5000
```

### Terminal 2 - Start Frontend
```bash
cd frontend
npm install
npm start
# Browser opens automatically at http://localhost:3000
```

### Test
1. Sign up with email/password
2. Enter message: "What does the Bible say about faith?"
3. Verify AI response with scripture references
4. Refresh page - chat history persists

---

## 🔍 Finding Things in the Code

### I want to...
**Change login page styling**
→ Edit `frontend/src/styles/App.css` (search for `.login-`)

**Modify AI behavior**
→ Edit `backend/routes/chat.js` (search for `BIBLE_SYSTEM_PROMPT`)

**Add new API endpoint**
→ Create new route file in `backend/routes/`
→ Import and use in `backend/server.js`

**Change chat UI colors**
→ Edit `frontend/src/styles/App.css` (search for color values)

**Add new authentication method**
→ Add function to `frontend/src/services/auth.js`
→ Use from Login.js

**Modify database schema**
→ Change data structure when saving in `backend/routes/chat.js`
→ Update Firestore security rules

---

## ✅ File Checklist

Frontend files:
- ✅ package.json
- ✅ .env.example
- ✅ .gitignore
- ✅ public/index.html
- ✅ src/index.js
- ✅ src/App.js
- ✅ src/pages/Login.js
- ✅ src/pages/Chat.js
- ✅ src/components/Header.js
- ✅ src/services/firebase.js
- ✅ src/services/auth.js
- ✅ src/services/api.js
- ✅ src/styles/App.css

Backend files:
- ✅ package.json
- ✅ .env.example
- ✅ .gitignore
- ✅ server.js
- ✅ config/firebase.js
- ✅ middleware/auth.js
- ✅ routes/chat.js

Documentation:
- ✅ README.md
- ✅ QUICK_START.md
- ✅ FIREBASE_SETUP.md
- ✅ OPENAI_SETUP.md
- ✅ PROJECT_SUMMARY.md
- ✅ FILE_REFERENCE.md (this file)

---

## 📞 Quick Troubleshooting

| Issue | File to Check |
|-------|---------------|
| Frontend won't load | `frontend/src/App.js`, `frontend/src/index.js` |
| Login not working | `frontend/src/services/auth.js` |
| Chat not sending | `frontend/src/pages/Chat.js`, `backend/routes/chat.js` |
| Messages not saving | `backend/routes/chat.js`, Firebase rules |
| API errors | `backend/server.js`, `backend/routes/chat.js` |
| Styling issues | `frontend/src/styles/App.css` |
| Auth errors | `backend/middleware/auth.js` |

---

## 🎓 Learning Guide

Read files in this order to understand the codebase:

1. **README.md** - Understand the project
2. **backend/server.js** - See Express setup
3. **backend/routes/chat.js** - Understand API logic
4. **frontend/src/App.js** - See React routing
5. **frontend/src/pages/Chat.js** - See chat UI logic
6. **frontend/src/services/api.js** - See API client

Then read individual files to understand details.

---

## 📦 Dependencies Summary

### Frontend
- `react@18.2.0` - UI library
- `react-dom@18.2.0` - DOM rendering
- `react-router-dom@6.20.0` - Client-side routing
- `firebase@10.7.0` - Auth and Firestore
- `axios@1.6.2` - HTTP client

### Backend
- `express@4.18.2` - Web framework
- `firebase-admin@12.0.0` - Firebase admin
- `axios@1.6.2` - HTTP client
- `dotenv@16.3.1` - Environment variables
- `cors@2.8.5` - CORS middleware
- `express-async-errors@3.1.1` - Async error handling

---

## 🔒 Security Files

- **backend/middleware/auth.js** - Token verification
- **backend/.env.example** - Secrets management
- **frontend/.env.example** - Config management
- **backend/.gitignore** - Prevent secrets in git
- **frontend/.gitignore** - Prevent secrets in git

---

This file is your reference guide. Bookmark this page for quick lookups!

---

**Need help? Check README.md or QUICK_START.md**
