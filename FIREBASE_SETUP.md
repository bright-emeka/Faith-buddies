# Firebase Setup Guide for Bible Social

This guide walks you through setting up Firebase for the Bible Social application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: **Bible-Social** (or your choice)
4. Accept the terms and click "Create project"
5. Wait for project creation to complete

## Step 2: Enable Authentication

1. In your Firebase project, click **Authentication** in the left sidebar
2. Click "Get started"
3. Under "Sign-in method", click **Email/Password**
4. Toggle "Enable" to ON
5. Click "Save"

Now your app can handle email/password registration and login.

## Step 3: Create Firestore Database

1. In Firebase Console, click **Firestore Database** in the left sidebar
2. Click "Create database"
3. Choose region (closest to your users, e.g., us-central1)
4. Choose **Start in test mode** (for development)
   - **Warning**: Test mode allows anyone to read/write. Configure security rules before production!
5. Click "Create"

## Step 4: Get Firebase Configuration

1. Go to **Project Settings** (gear icon in top left)
2. Click the **General** tab
3. Scroll down to "Your apps" section
4. If no app exists, click "Create app" and select "Web" (</>)
5. Register the app with name "Bible Social Web"
6. Copy the Firebase config object - it looks like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDp...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

7. Paste these values into **frontend/.env**:

```
REACT_APP_FIREBASE_API_KEY=AIzaSyDp...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## Step 5: Generate Service Account Key (Backend)

The backend needs a service account key for admin access to Firestore.

1. Go to **Project Settings** (gear icon)
2. Click **Service Accounts** tab
3. Under "Firebase Admin SDK", choose "Node.js"
4. Click "Generate New Private Key"
5. A JSON file will download - **save this securely**

The JSON file contains sensitive credentials. It looks like:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

6. Add to **backend/.env**:

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...","...":"..."}'
```

⚠️ **Important**: Paste the ENTIRE JSON as a single string in `.env`. Make sure to:
- Use single quotes around the entire JSON
- Keep the newlines as `\n` in the private key
- Don't break it into multiple lines

## Step 6: Create Firestore Collections

The backend will automatically create collections when data is saved, but you can create them manually:

### Users Collection
1. In Firestore Database, click "Start collection"
2. Name: **users**
3. Click "Auto-ID" for first document
4. Add field (example):
   - Field: `id` | Type: `string` | Value: `user123`
   - Field: `name` | Type: `string` | Value: `John Doe`
   - Field: `email` | Type: `string` | Value: `john@example.com`
   - Field: `createdAt` | Type: `string` | Value: `2024-01-24T...`
5. Click "Save"

### Chats Collection
1. Click "Start collection" again
2. Name: **chats**
3. Click "Auto-ID" for first document
4. Add fields (example):
   - Field: `userId` | Type: `string` | Value: `user123`
   - Field: `messages` | Type: `array` | (leave empty, will populate on first message)
   - Field: `updatedAt` | Type: `string` | Value: `2024-01-24T...`
5. Click "Save"

## Step 7: Configure Firestore Security Rules (Important!)

By default in test mode, anyone can read/write data. For production, add security rules:

1. In Firestore Database, click **Rules** tab
2. Replace default rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - only own documents
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Chats collection - only own chats
    match /chats/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

## Step 8: Verify Backend Configuration

Test your backend setup:

```bash
cd backend

# Create .env with your values
cp .env.example .env
# Edit .env with Firebase and OpenAI keys

# Install dependencies
npm install

# Start server
npm run dev

# Test health endpoint in browser
curl http://localhost:5000/health
# Should return: {"status":"Server is running","timestamp":"..."}
```

If you see Firebase connection errors:
- Check `FIREBASE_PROJECT_ID` is correct
- Check `FIREBASE_SERVICE_ACCOUNT_KEY` is valid JSON
- Verify Firestore database is created and in "test mode"

## Step 9: Verify Frontend Configuration

Test your frontend setup:

```bash
cd frontend

# Create .env with Firebase credentials
cp .env.example .env
# Edit .env with Firebase config from Step 4

# Install dependencies
npm install

# Start frontend
npm start

# Frontend should open at http://localhost:3000
```

If you see Firebase errors:
- Check all `REACT_APP_FIREBASE_*` values are correct
- Verify Authentication is enabled in Firebase Console
- Check browser console (F12) for specific errors

## Troubleshooting

### "Firebase project not found"
- Verify `FIREBASE_PROJECT_ID` matches your Firebase project exactly
- Check in Firebase Console > Project Settings > General

### "Permission denied" when writing to Firestore
- Make sure Firestore is in "test mode" (see Step 3)
- Or update security rules to allow authenticated users (see Step 7)

### "Invalid service account key"
- Download a fresh service account key (Step 5)
- Make sure entire JSON is in one line in `.env`
- Use single quotes around the entire JSON string

### "Service account key has expired"
- You can't regenerate the same key
- Delete the old key in Project Settings > Service Accounts
- Generate a new one

### "Authentication not enabled"
- Go to Firebase Console > Authentication
- Make sure Email/Password provider is enabled (Step 2)

## Next Steps

1. Set up OpenAI API key (see main README)
2. Run backend and frontend
3. Create a test account
4. Try chatting with the Bible AI

## Production Deployment

When deploying to production:

1. **Update Security Rules**: Remove test mode rules (Step 7)
2. **Use Environment Variables**: Never commit `.env` files
3. **Enable HTTPS**: Required for Firebase Auth
4. **Update CORS**: Set `FRONTEND_URL` to your production domain
5. **Monitor Costs**: Check Firebase usage estimates
6. **Backup Data**: Enable Firestore backups in Project Settings

## Firebase Console Links

- [Firebase Console](https://console.firebase.google.com/)
- [Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)

---

Need help? Check the main README.md or Firebase documentation.
