// Firebase Admin configuration
const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK with service account
// Download your service account key from Firebase Console:
// Project Settings > Service Accounts > Generate New Private Key
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
