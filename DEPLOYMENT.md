# Deployment Guide - Bible Social

Deploy your Bible Social app to production.

---

## 🚀 Deployment Architecture

```
Frontend (Vercel/Firebase Hosting)
    ↓ HTTPS
API Gateway (CORS)
    ↓ HTTPS
Backend (Heroku/Render/Railway)
    ↓
Firebase (Firestore + Auth)
    ↓
OpenAI API
```

---

## 📝 Pre-Deployment Checklist

- [ ] All code tested locally
- [ ] Environment variables collected
- [ ] Firebase security rules configured
- [ ] OpenAI API credits verified
- [ ] Backend health check working
- [ ] Frontend build succeeds
- [ ] No secrets in git history
- [ ] .env files not committed

---

## ☁️ Option 1: Deploy Backend to Heroku

### 1. Create Heroku Account
1. Go to [Heroku.com](https://www.heroku.com/)
2. Sign up and verify email
3. Install Heroku CLI ([Download](https://devcenter.heroku.com/articles/heroku-cli))

### 2. Create Heroku App
```bash
cd backend
heroku login
heroku create your-app-name
# Example: heroku create bible-social-api
```

### 3. Set Environment Variables
```bash
heroku config:set FIREBASE_PROJECT_ID=your-project-id
heroku config:set FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
heroku config:set OPENAI_API_KEY=sk-your-key
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-frontend-domain.com
```

### 4. Deploy
```bash
git push heroku main
# Or: git push heroku master
```

### 5. Monitor Logs
```bash
heroku logs --tail
```

### 6. Get Backend URL
```bash
heroku apps:info
# Note the Heroku domain: https://your-app-name.herokuapp.com
```

Update frontend `.env`:
```
REACT_APP_API_URL=https://your-app-name.herokuapp.com
```

---

## ☁️ Option 2: Deploy Backend to Render

### 1. Create Render Account
1. Go to [Render.com](https://render.com/)
2. Sign up with GitHub/GitLab
3. Connect your repository

### 2. Create Web Service
1. Click "New" → "Web Service"
2. Select your GitHub repository
3. Fill in settings:
   - **Name**: bible-social-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free tier (for testing)

### 3. Set Environment Variables
In Render dashboard:
1. Go to your service
2. Click "Environment"
3. Add variables:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_SERVICE_ACCOUNT_KEY`
   - `OPENAI_API_KEY`
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://your-frontend-domain.com`

### 4. Deploy
Push to GitHub, Render auto-deploys

### 5. Get Backend URL
```
https://your-app-name.onrender.com
```

---

## ☁️ Option 3: Deploy Backend to Railway

### 1. Create Railway Account
1. Go to [Railway.app](https://railway.app/)
2. Sign up with GitHub
3. Connect repository

### 2. Create Project
1. Click "New Project"
2. Select "Deploy from GitHub"
3. Choose your repository
4. Configure:
   - **Service**: Node.js
   - **Environment**: Production

### 3. Set Environment Variables
1. In Railway dashboard, go to "Variables"
2. Add all required `.env` variables

### 4. Deploy
Railway auto-deploys on git push

### 5. Get Backend URL
```
https://your-project.railway.app
```

---

## 🎨 Option 1: Deploy Frontend to Vercel

### 1. Create Vercel Account
1. Go to [Vercel.com](https://vercel.com/)
2. Sign up and connect GitHub

### 2. Deploy Project
1. Click "New Project"
2. Import your repository
3. Select "frontend" as root directory
4. Click "Deploy"

### 3. Configure Environment Variables
1. In Vercel dashboard, go to "Settings" → "Environment Variables"
2. Add all `REACT_APP_*` variables:
   ```
   REACT_APP_FIREBASE_API_KEY=...
   REACT_APP_FIREBASE_AUTH_DOMAIN=...
   REACT_APP_FIREBASE_PROJECT_ID=...
   REACT_APP_FIREBASE_STORAGE_BUCKET=...
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
   REACT_APP_FIREBASE_APP_ID=...
   REACT_APP_API_URL=https://your-backend-url.com
   ```

### 4. Redeploy
1. Go to "Deployments"
2. Click "Redeploy" to pick up new environment variables

### 5. Get Frontend URL
```
https://your-project.vercel.app
```

---

## 🎨 Option 2: Deploy Frontend to Firebase Hosting

### 1. Create Firebase Hosting
1. Go to Firebase Console
2. Click "Hosting"
3. Click "Get started"
4. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

### 2. Configure Hosting
```bash
cd frontend
firebase init hosting
# Select your Firebase project
# Build directory: build
# Configure as SPA: Yes
```

### 3. Build and Deploy
```bash
npm run build
firebase deploy --only hosting
```

### 4. Get Frontend URL
```
https://your-project.web.app
```

---

## 🎨 Option 3: Deploy Frontend to Netlify

### 1. Create Netlify Account
1. Go to [Netlify.com](https://www.netlify.com/)
2. Sign up and connect GitHub

### 2. Deploy
1. Click "New site from Git"
2. Select your repository
3. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - **Base directory**: `frontend`

### 3. Set Environment Variables
1. In Netlify dashboard, go to "Site settings" → "Build & Deploy" → "Environment"
2. Add `REACT_APP_*` variables

### 4. Deploy
Click "Deploy site"

### 5. Get Frontend URL
```
https://your-project.netlify.app
```

---

## 🔐 Post-Deployment Security

### 1. Update Firebase Security Rules
Move from test mode to production:

```firestore-rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can access their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    match /chats/{chatId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

1. Go to Firebase Console → Firestore → Rules
2. Paste security rules
3. Click "Publish"

### 2. Update Firebase Authentication
1. Go to Firebase Console → Authentication → Settings
2. Add authorized domains:
   - Your frontend domain (e.g., `bible-social.vercel.app`)
   - Don't forget to update before every deployment

### 3. Enable HTTPS
All production URLs should be HTTPS (automatic with Vercel/Render/Railway/Firebase)

### 4. Configure CORS on Backend
In `backend/server.js`, update CORS:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
```

Make sure `FRONTEND_URL` is set to production domain.

---

## 📊 Environment Variables Summary

### Production Backend
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
OPENAI_API_KEY=sk-your-production-key
NODE_ENV=production
PORT=auto-assigned
FRONTEND_URL=https://your-frontend-domain.com
```

### Production Frontend
```
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:...
REACT_APP_API_URL=https://your-backend-url.com
```

---

## 🧪 Test Production Deployment

### 1. Test Backend
```bash
curl https://your-backend-url.com/health
# Should return: {"status":"Server is running",...}
```

### 2. Test Frontend
1. Open https://your-frontend-domain.com
2. Sign up with test account
3. Send message: "John 3:16"
4. Verify AI responds with scripture

### 3. Monitor Logs
- **Vercel Frontend**: Dashboard → "Functions" → Logs
- **Heroku Backend**: `heroku logs --tail`
- **Render Backend**: Dashboard → "Logs"
- **Railway Backend**: Dashboard → "Logs"

---

## 📈 Monitoring & Maintenance

### Monitor API Performance
```bash
# Heroku
heroku apps:info your-app-name

# Check API latency
curl -w "@curl-format.txt" https://your-api.com/health
```

### Monitor Firebase Usage
1. Go to Firebase Console
2. Click "Usage" in left sidebar
3. Monitor:
   - Database reads/writes
   - Authentication
   - Functions (if used)

### Monitor OpenAI Costs
1. Go to OpenAI Platform
2. Click "Usage"
3. Set budget alerts:
   - Settings → Billing → Usage Limits

---

## 🚨 Troubleshooting Production

### "CORS errors"
- Check `FRONTEND_URL` in backend env vars
- Ensure frontend domain matches exactly
- Redeploy backend after changing CORS settings

### "Firebase auth not working"
- Add frontend domain to Firebase authorized domains
- Go to Firebase Console → Authentication → Settings
- Add your production domain

### "API calls failing"
- Check backend logs for errors
- Verify all environment variables are set
- Test backend health endpoint

### "Chat not saving"
- Check Firestore security rules
- Verify Firebase quota not exceeded
- Check Firestore data in Firebase Console

### "Slow responses"
- Check OpenAI API status
- Monitor cold starts (first request slower)
- Check Firebase database performance

---

## 💾 Database Backups

### Firebase Automatic Backups
1. Go to Firebase Console
2. Firestore Database → Backups
3. Enable automated backups (paid feature)

### Manual Backup
```bash
# Export Firestore data
gcloud firestore export gs://your-bucket/backup

# Restore from backup
gcloud firestore restore gs://your-bucket/backup
```

---

## 📊 Scaling Considerations

### When Traffic Increases
1. **Firestore**: Automatically scales (within quota)
2. **Firebase Auth**: Unlimited users (with quotas)
3. **Backend Server**: 
   - Heroku hobby tier: limited
   - Render/Railway: auto-scales
   - Consider paid tier

4. **OpenAI API**: Check rate limits and costs

### Optimization
- Add caching layer for frequent queries
- Implement request throttling
- Monitor and optimize Firestore indexes
- Consider CDN for frontend static files

---

## 🎯 Production Checklist

Before going live:

### Security
- [ ] No API keys in code
- [ ] HTTPS enabled everywhere
- [ ] Firebase security rules configured
- [ ] CORS properly configured
- [ ] Environment variables set

### Performance
- [ ] Backend responds in <2 seconds
- [ ] Frontend loads in <3 seconds
- [ ] Chat messages send/receive smoothly
- [ ] No console errors

### Functionality
- [ ] Sign up works
- [ ] Login works
- [ ] Chat sends and receives
- [ ] History persists
- [ ] Logout works

### Monitoring
- [ ] Error logs accessible
- [ ] Can monitor API usage
- [ ] Firebase metrics visible
- [ ] OpenAI costs tracked

### Documentation
- [ ] Deployment procedure documented
- [ ] Environment variables documented
- [ ] Monitoring procedures documented
- [ ] Rollback procedure ready

---

## 🔄 Continuous Deployment

Set up auto-deployment:

### GitHub → Vercel (Frontend)
Already configured - auto-deploys on git push

### GitHub → Heroku/Render/Railway (Backend)
1. Connect GitHub to deployment service
2. Enable auto-deploy on main branch
3. Set deployment environment variables

### Deployment Command
Deployment services typically run:
```bash
npm install
npm start
```

Ensure `package.json` scripts are correct!

---

## 📞 Support

If deployment fails:

1. Check deployment platform logs
2. Verify environment variables are set
3. Test locally to confirm issue isn't local
4. Check Firebase Console for errors
5. Review API key validity

### Common Deployment URLs
- **Vercel**: https://dashboard.vercel.com
- **Heroku**: https://dashboard.heroku.com
- **Render**: https://dashboard.render.com
- **Firebase Hosting**: https://console.firebase.google.com
- **Firebase Analytics**: https://analytics.google.com

---

## 🎓 Next Steps

1. ✅ Deploy backend
2. ✅ Deploy frontend
3. ✅ Configure security rules
4. ✅ Test production
5. ✅ Set up monitoring
6. 📣 Share with users!

---

**Ready to go live? Follow the steps above and you're done!**

For questions, check main README.md or specific platform documentation.
