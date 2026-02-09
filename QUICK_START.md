# Quick Start Guide - Bible Social MVP

Get the application running in 15 minutes!

## Prerequisites

Have these ready:
- Node.js 14+ installed ([Download](https://nodejs.org/))
- Firebase project credentials (see FIREBASE_SETUP.md)
- OpenAI API key (see OPENAI_SETUP.md)

## 5-Minute Setup

### 1. Configure Environment Variables

**Backend** (`backend/.env`):
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
OPENAI_API_KEY=sk-your-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env`):
```
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc
REACT_APP_API_URL=http://localhost:5000
```

### 2. Start Backend

```bash
cd backend
npm install
npm run dev
```

Expected output:
```
🙏 Bible Social API running on http://localhost:5000
```

### 3. Start Frontend (new terminal)

```bash
cd frontend
npm install
npm start
```

Expected output:
```
webpack compiled successfully
On Your Network: http://192.168.x.x:3000
```

Browser opens automatically at `http://localhost:3000`

## Test the Application

1. **Sign Up**:
   - Click "Sign Up"
   - Enter email, password, and name
   - Click "Sign Up"

2. **Chat**:
   - Enter message: "What does the Bible say about love?"
   - Click "Send"
   - Wait for AI response with scripture references

3. **Check History**:
   - Refresh the page
   - Chat history persists (stored in Firestore)

4. **Logout**:
   - Click "Logout" button
   - Redirected to login page

## Troubleshooting

### Frontend won't start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Backend API errors
- Check backend terminal for error messages
- Verify all environment variables are set: `echo $FIREBASE_PROJECT_ID`
- Restart backend: `npm run dev`

### Firebase authentication errors
- Confirm Email/Password is enabled in Firebase Console
- Check Firebase project ID matches `.env`

### OpenAI API errors
- Verify API key is correct
- Check you have payment method on OpenAI account
- Verify API credits available

### CORS errors
- Make sure `FRONTEND_URL` in backend `.env` is correct
- Frontend should be `http://localhost:3000`
- Backend should be `http://localhost:5000`

## File Structure Quick Reference

```
Bible social/
├── frontend/src/
│   ├── App.js              ← Main app logic
│   ├── pages/
│   │   ├── Login.js        ← Sign up/login
│   │   └── Chat.js         ← AI chat UI
│   └── services/
│       ├── firebase.js     ← Firebase config
│       ├── auth.js         ← Login functions
│       └── api.js          ← Backend calls
│
├── backend/
│   ├── server.js           ← Express app
│   ├── routes/chat.js      ← API endpoints
│   └── config/firebase.js  ← Firebase admin
```

## Common Tasks

### Change AI behavior
Edit system prompt in `backend/routes/chat.js` (search for `BIBLE_SYSTEM_PROMPT`)

### Add new API endpoint
1. Create route in `backend/routes/`
2. Add to `backend/server.js`
3. Call from frontend using `api.js`

### Change styling
Edit `frontend/src/styles/App.css`

### Test API directly
```bash
# Get chat history (requires valid token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/chat/history/USER_ID

# Check server health
curl http://localhost:5000/health
```

## Next Steps

1. ✅ Both servers running locally
2. ✅ Can sign up and login
3. ✅ Chat with AI Bible buddy
4. 📖 Read full README.md for more features
5. 🚀 Deploy to production (Heroku, Vercel, Firebase Hosting)

## Production Deployment

When ready to deploy:

1. **Backend**: Deploy to Heroku, Render, or Railway
   - Set environment variables on hosting platform
   - Update `FRONTEND_URL` to production domain

2. **Frontend**: Deploy to Vercel or Firebase Hosting
   - Update `REACT_APP_API_URL` to production backend
   - Update `REACT_APP_FIREBASE_*` if using different project

3. **Firebase**: Configure security rules
   - Move from test mode to production rules
   - See FIREBASE_SETUP.md Step 7

## Getting Help

1. Check `README.md` for detailed documentation
2. See `FIREBASE_SETUP.md` for Firebase issues
3. See `OPENAI_SETUP.md` for OpenAI issues
4. Check backend terminal for API errors
5. Check browser console (F12) for frontend errors

## Performance Tips

- Backend caches API tokens (faster on subsequent requests)
- Frontend loads chat history on first load
- Message history prevents duplicate sending
- Firestore rules optimize read/write operations

---

**Happy chatting with your Bible AI buddy! 📖**
