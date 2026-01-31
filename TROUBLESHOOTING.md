# 🔧 Deployment Troubleshooting Guide

## Common Issues & Solutions

---

## 🔴 Backend Issues (Render)

### Issue 1: Build Failed
**Error**: `npm install` fails or dependencies not found

**Solutions**:
1. Check `package.json` has all dependencies (not in devDependencies)
2. Verify Node.js version compatibility
3. Clear build cache on Render:
   - Settings → Build & Deploy → Clear build cache
4. Check Render logs for specific error

**Verify**:
```bash
# Test locally first
cd reg-backend
rm -rf node_modules package-lock.json
npm install
npm start
```

---

### Issue 2: Application Failed to Respond
**Error**: Service shows "Application failed to respond" or times out

**Solutions**:
1. Check if server is listening on correct PORT:
   ```javascript
   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => {
       console.log(`Server running on port ${PORT}`);
   });
   ```

2. Verify environment variables are set in Render
3. Check Render logs for errors
4. Ensure MongoDB connection is successful

**Check Logs**:
- Render Dashboard → Your Service → Logs
- Look for `[SERVER] Cyberpunk Backend Online`
- Look for `[DATABASE] Connected to MongoDB Atlas`

---

### Issue 3: MongoDB Connection Failed
**Error**: `MongoServerSelectionError` or `bad auth: authentication failed`

**Solutions**:

1. **Check MongoDB URI**:
   ```env
   # Correct format:
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   
   # Common mistakes:
   # ❌ Missing database name
   # ❌ Wrong password
   # ❌ Special characters not URL encoded
   ```

2. **Update Network Access in MongoDB Atlas**:
   - Go to MongoDB Atlas → Network Access
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add Render's IP ranges

3. **Verify Database User**:
   - MongoDB Atlas → Database Access
   - Ensure user exists and has read/write permissions
   - Password is correct (no special characters issues)

4. **Test Connection Locally**:
   ```bash
   cd reg-backend
   npm start
   # Should see: [DATABASE] Connected to MongoDB Atlas
   ```

**MongoDB Atlas IP Whitelist for Render**:
```
0.0.0.0/0  (Allow from anywhere - easiest but less secure)
```

---

### Issue 4: CORS Errors
**Error**: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solutions**:

1. **Update CORS in backend** (`reg-backend/src/index.js`):
   ```javascript
   const allowedOrigins = [
       'http://localhost:5173',
       'https://your-actual-app.vercel.app',  // ← Update this!
   ];
   ```

2. **Commit and push changes**:
   ```bash
   git add .
   git commit -m "Update CORS with Vercel URL"
   git push
   ```

3. **Render will auto-deploy** (or manually redeploy)

4. **Verify in browser console**:
   - Should see successful API calls
   - No CORS errors

---

### Issue 5: JWT Token Issues
**Error**: `Invalid or expired token` or `Token missing`

**Solutions**:

1. **Ensure JWT_SECRET is set** in Render environment variables
2. **Check token format** in frontend:
   ```javascript
   headers: {
       'Authorization': `Bearer ${token}`  // Must have "Bearer " prefix
   }
   ```

3. **Clear browser localStorage** and login again
4. **Verify token is being sent**:
   - Browser DevTools → Network → Request Headers
   - Should see: `Authorization: Bearer eyJhbGc...`

---

## 🔵 Frontend Issues (Vercel)

### Issue 1: Build Failed
**Error**: Vite build fails or TypeScript errors

**Solutions**:

1. **Test build locally**:
   ```bash
   cd reg-frontend
   npm run build
   ```

2. **Fix any TypeScript errors**:
   - Check `tsconfig.json` configuration
   - Ensure all imports are correct

3. **Verify dependencies**:
   ```bash
   npm install
   ```

4. **Check Vercel build logs**:
   - Vercel Dashboard → Project → Deployments → Latest → View Logs

---

### Issue 2: 404 on Page Refresh
**Error**: Refreshing any page except home shows 404

**Solutions**:

1. **Ensure `vercel.json` exists** (already created ✓):
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

2. **Redeploy** if file was just added:
   ```bash
   vercel --prod
   ```

---

### Issue 3: Environment Variables Not Working
**Error**: API calls go to wrong URL or `undefined`

**Solutions**:

1. **Verify environment variable name**:
   - Must start with `VITE_`
   - Example: `VITE_API_URL` ✓
   - Example: `API_URL` ❌

2. **Check Vercel environment variables**:
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Ensure `VITE_API_URL` is set for Production

3. **Redeploy after adding variables**:
   - Changes require a new deployment

4. **Verify in code**:
   ```javascript
   console.log('API URL:', import.meta.env.VITE_API_URL);
   ```

---

### Issue 4: API Calls Failing
**Error**: Network errors, failed to fetch, or timeout

**Solutions**:

1. **Check API URL**:
   ```javascript
   // Should be:
   VITE_API_URL=https://reg-backend.onrender.com/api
   
   // NOT:
   VITE_API_URL=https://reg-backend.onrender.com/api/  // ❌ trailing slash
   VITE_API_URL=http://reg-backend.onrender.com/api    // ❌ http instead of https
   ```

2. **Verify backend is running**:
   - Visit: `https://reg-backend.onrender.com/`
   - Should see: "Cyberpunk Registration API"

3. **Check browser console**:
   - Look for specific error messages
   - Check Network tab for failed requests

4. **Test API directly**:
   ```bash
   curl https://reg-backend.onrender.com/api/vehicle-types
   ```

---

### Issue 5: Blank Page or White Screen
**Error**: Application loads but shows nothing

**Solutions**:

1. **Check browser console** for JavaScript errors

2. **Verify build output**:
   ```bash
   cd reg-frontend
   npm run build
   npm run preview  # Test production build locally
   ```

3. **Check for missing dependencies**:
   ```bash
   npm install
   ```

4. **Clear browser cache**:
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

## 🟡 Database Issues (MongoDB Atlas)

### Issue 1: Connection Timeout
**Error**: `MongoServerSelectionError: connection timed out`

**Solutions**:

1. **Check Network Access**:
   - MongoDB Atlas → Network Access
   - Add IP: 0.0.0.0/0 (allow from anywhere)

2. **Verify connection string**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/dbname
   ```

3. **Check cluster status**:
   - MongoDB Atlas → Clusters
   - Ensure cluster is running (not paused)

---

### Issue 2: Authentication Failed
**Error**: `bad auth: authentication failed`

**Solutions**:

1. **Verify credentials**:
   - Username: `rssasivarnan_db_user`
   - Password: `sasivarnan`
   - Check for typos

2. **Check database user**:
   - MongoDB Atlas → Database Access
   - Ensure user exists and has correct permissions

3. **URL encode special characters** in password:
   ```
   @ → %40
   : → %3A
   / → %2F
   ```

---

### Issue 3: Storage Limit Reached
**Error**: `Quota exceeded` or write operations fail

**Solutions**:

1. **Check storage usage**:
   - MongoDB Atlas → Clusters → Metrics

2. **Free tier limit**: 512MB
   - Delete old test data
   - Upgrade to paid tier if needed

3. **Optimize data**:
   - Remove unnecessary fields
   - Compress large documents

---

## 🟢 General Issues

### Issue 1: Slow First Load (Render)
**Behavior**: First request takes 30-60 seconds

**Explanation**: This is NORMAL on Render's free tier
- Services spin down after 15 minutes of inactivity
- First request "wakes up" the service

**Solutions**:
1. **Accept it** (free tier limitation)
2. **Upgrade to paid tier** (always on)
3. **Use a ping service** to keep it awake (not recommended)

---

### Issue 2: Changes Not Reflecting
**Error**: Code changes don't appear after deployment

**Solutions**:

1. **Clear browser cache**:
   - Hard refresh: Ctrl+Shift+R

2. **Verify deployment**:
   - Check Vercel/Render deployment logs
   - Ensure latest commit is deployed

3. **Check correct branch**:
   - Ensure deploying from correct branch (usually `main`)

4. **Force redeploy**:
   - Vercel: Deployments → ⋯ → Redeploy
   - Render: Manual Deploy → Deploy latest commit

---

### Issue 3: SSL/HTTPS Issues
**Error**: Mixed content warnings or SSL errors

**Solutions**:

1. **Use HTTPS everywhere**:
   ```javascript
   // ✓ Correct
   VITE_API_URL=https://reg-backend.onrender.com/api
   
   // ❌ Wrong
   VITE_API_URL=http://reg-backend.onrender.com/api
   ```

2. **Both Vercel and Render provide automatic SSL**
   - No configuration needed

---

## 🛠️ Debugging Tools

### Browser DevTools
```
F12 or Right-click → Inspect

Tabs to check:
1. Console - JavaScript errors
2. Network - API calls and responses
3. Application - LocalStorage, cookies
4. Sources - Breakpoints for debugging
```

### Backend Logs (Render)
```
Render Dashboard → Service → Logs

Look for:
- [SERVER] messages
- [DATABASE] messages
- Error stack traces
```

### Frontend Logs (Vercel)
```
Vercel Dashboard → Project → Deployments → View Function Logs

Look for:
- Build errors
- Runtime errors
```

### MongoDB Logs (Atlas)
```
MongoDB Atlas → Clusters → Metrics

Check:
- Connection attempts
- Query performance
- Storage usage
```

---

## 📞 Getting Help

### 1. Check Documentation
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- MongoDB: https://www.mongodb.com/docs/atlas

### 2. Check Status Pages
- Render: https://status.render.com
- Vercel: https://www.vercel-status.com
- MongoDB: https://status.cloud.mongodb.com

### 3. Community Support
- Render Community: https://community.render.com
- Vercel Discord: https://vercel.com/discord
- MongoDB Forums: https://www.mongodb.com/community/forums

---

## ✅ Verification Checklist

After fixing issues, verify:

- [ ] Backend URL responds: `https://your-backend.onrender.com/`
- [ ] API endpoint works: `https://your-backend.onrender.com/api/vehicle-types`
- [ ] Frontend loads: `https://your-app.vercel.app`
- [ ] No console errors in browser
- [ ] Can register new user
- [ ] Can login
- [ ] Can create registration
- [ ] Dashboard shows data
- [ ] No CORS errors

---

## 🎯 Still Having Issues?

1. **Double-check all environment variables**
2. **Review deployment logs carefully**
3. **Test each component individually**
4. **Compare with working local setup**
5. **Check all URLs for typos**

**Remember**: Most deployment issues are due to:
- ❌ Incorrect environment variables
- ❌ CORS misconfiguration
- ❌ MongoDB network access
- ❌ Typos in URLs

Take your time and check each step carefully! 🚀
