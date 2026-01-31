# 🚀 Quick Deployment Reference

## Backend → Render

### 1. Create Web Service
```
Dashboard → New + → Web Service → Connect GitHub
```

### 2. Configuration
| Setting | Value |
|---------|-------|
| Name | `reg-backend` |
| Root Directory | `reg-backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |

### 3. Environment Variables
```env
PORT=5000
MONGODB_URI=mongodb+srv://rssasivarnan_db_user:sasivarnan@cluster0.bfkp4js.mongodb.net/reg-number?retryWrites=true&w=majority
JWT_SECRET=cyberpunk_secret_key_2077
NODE_ENV=production
```

### 4. Deploy & Get URL
```
https://reg-backend.onrender.com
```

---

## Frontend → Vercel

### Option 1: CLI (Fast)
```bash
cd reg-frontend
npm install -g vercel
vercel login
vercel
# Follow prompts
vercel env add VITE_API_URL production
# Enter: https://reg-backend.onrender.com/api
vercel --prod
```

### Option 2: Dashboard
```
1. Import Git Repository
2. Root Directory: reg-frontend
3. Framework: Vite
4. Build Command: npm run build
5. Output Directory: dist
6. Add Environment Variable:
   VITE_API_URL = https://reg-backend.onrender.com/api
7. Deploy
```

---

## Post-Deployment

### Update CORS in Backend
Edit `reg-backend/src/index.js`:
```javascript
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://your-app.vercel.app'  // ← Add your Vercel URL
    ],
    credentials: true
}));
```

### MongoDB Atlas Network Access
```
Network Access → Add IP → Allow from Anywhere (0.0.0.0/0)
```

---

## Testing

### Backend
```bash
curl https://reg-backend.onrender.com/
curl https://reg-backend.onrender.com/api/vehicle-types
```

### Frontend
```
Visit: https://your-app.vercel.app
Test: Registration, Login, Dashboard
```

---

## Common Issues

| Issue | Solution |
|-------|----------|
| CORS Error | Update backend CORS with Vercel URL |
| MongoDB Connection Failed | Check Network Access in Atlas |
| 404 on Refresh | `vercel.json` already added ✓ |
| Env vars not working | Redeploy after adding variables |
| Slow first load | Render free tier spins down (normal) |

---

## URLs After Deployment

- **Backend**: `https://reg-backend.onrender.com`
- **Frontend**: `https://reg-number-plate.vercel.app`
- **MongoDB**: Already configured ✓

---

## Deployment Time
- **Backend (Render)**: ~3-5 minutes
- **Frontend (Vercel)**: ~1-3 minutes
- **Total**: ~5-8 minutes

🎉 **You're all set!**
