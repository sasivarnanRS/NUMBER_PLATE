# 📋 Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## Pre-Deployment ✅

### Code Preparation
- [ ] All code committed to Git
- [ ] `.env` files NOT committed (check `.gitignore`)
- [ ] Backend builds successfully locally (`npm start` in reg-backend)
- [ ] Frontend builds successfully locally (`npm run build` in reg-frontend)
- [ ] All tests pass (if applicable)
- [ ] Code pushed to GitHub repository

### Environment Variables Ready
- [ ] MongoDB Atlas connection string ready
- [ ] JWT secret key ready (or using default)
- [ ] All sensitive data documented (not in code)

### Database Setup
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with proper permissions
- [ ] Network access configured (will update after deployment)

---

## Backend Deployment (Render) 🚀

### Initial Setup
- [ ] Render account created
- [ ] GitHub repository connected to Render

### Service Configuration
- [ ] Web Service created
- [ ] Service name: `reg-backend` (or your choice)
- [ ] Root directory: `reg-backend`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Region selected

### Environment Variables
- [ ] `PORT` = `5000`
- [ ] `MONGODB_URI` = `mongodb+srv://...` (your connection string)
- [ ] `JWT_SECRET` = `cyberpunk_secret_key_2077` (or custom)
- [ ] `NODE_ENV` = `production`

### Deployment
- [ ] Deploy button clicked
- [ ] Build completed successfully
- [ ] Service is live
- [ ] Backend URL noted: `https://__________.onrender.com`

### Verification
- [ ] Root endpoint works: `https://your-backend.onrender.com/`
- [ ] API endpoint works: `https://your-backend.onrender.com/api/vehicle-types`
- [ ] No errors in Render logs
- [ ] MongoDB connection successful (check logs)

---

## Frontend Deployment (Vercel) 🎨

### Initial Setup
- [ ] Vercel account created
- [ ] Vercel CLI installed (if using CLI method)

### Project Configuration
- [ ] Project imported/created
- [ ] Root directory: `reg-frontend`
- [ ] Framework preset: `Vite`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`

### Environment Variables
- [ ] `VITE_API_URL` = `https://your-backend.onrender.com/api`

### Deployment
- [ ] Deploy button clicked (or `vercel --prod` run)
- [ ] Build completed successfully
- [ ] Site is live
- [ ] Frontend URL noted: `https://__________.vercel.app`

### Verification
- [ ] Landing page loads correctly
- [ ] No console errors in browser
- [ ] Can navigate between pages
- [ ] API calls work (check Network tab)

---

## Post-Deployment Configuration 🔧

### Backend Updates
- [ ] Update CORS in `reg-backend/src/index.js` with Vercel URL
- [ ] Commit and push changes
- [ ] Render auto-deploys (or manually redeploy)

### MongoDB Atlas
- [ ] Network Access updated
- [ ] Added `0.0.0.0/0` (allow from anywhere) OR
- [ ] Added Render's specific IP ranges

### Testing
- [ ] Registration flow works end-to-end
- [ ] Login works
- [ ] Dashboard loads with data
- [ ] Admin features work (if applicable)
- [ ] All CRUD operations functional

---

## Optional Enhancements 🌟

### Custom Domains
- [ ] Custom domain purchased (if desired)
- [ ] Domain added to Vercel (frontend)
- [ ] Domain added to Render (backend)
- [ ] DNS records configured
- [ ] SSL certificates active

### Monitoring & Analytics
- [ ] Error tracking set up (e.g., Sentry)
- [ ] Analytics added (e.g., Google Analytics)
- [ ] Uptime monitoring configured

### Performance
- [ ] Lighthouse score checked
- [ ] Images optimized
- [ ] Caching configured
- [ ] CDN enabled (Vercel does this automatically)

---

## Troubleshooting Completed ✅

### If Issues Occurred
- [ ] CORS errors resolved
- [ ] MongoDB connection issues fixed
- [ ] Environment variables verified
- [ ] Build errors addressed
- [ ] 404 errors on refresh fixed (vercel.json added)

---

## Documentation 📚

### URLs Documented
- **Backend URL**: `https://____________________`
- **Frontend URL**: `https://____________________`
- **MongoDB Cluster**: `cluster0.bfkp4js.mongodb.net`

### Credentials Secured
- [ ] Admin credentials documented securely
- [ ] Database credentials stored safely
- [ ] JWT secret backed up
- [ ] All passwords in password manager

### Team Notified
- [ ] Deployment URLs shared with team
- [ ] Documentation updated
- [ ] README updated with live URLs

---

## Final Verification ✨

### End-to-End Testing
- [ ] Create new user account
- [ ] Login with new account
- [ ] Create a vehicle registration
- [ ] View registration in dashboard
- [ ] Logout and login again
- [ ] Admin login works (admin@email.com / admin)
- [ ] Admin can manage vehicle types
- [ ] All features tested on mobile
- [ ] All features tested on desktop

### Performance Check
- [ ] First load time acceptable
- [ ] Subsequent loads fast
- [ ] No memory leaks
- [ ] No console errors

---

## 🎉 Deployment Complete!

**Congratulations!** Your Vehicle Registration System is now live!

### Next Steps
1. Monitor logs for any errors
2. Gather user feedback
3. Plan future enhancements
4. Set up regular backups
5. Schedule maintenance windows

### Important Notes
- Render free tier spins down after 15 minutes of inactivity
- First request after inactivity may take 30-60 seconds
- Consider upgrading to paid tier for production use
- MongoDB Atlas free tier has 512MB storage limit

---

**Date Deployed**: _______________
**Deployed By**: _______________
**Version**: 1.0.0
