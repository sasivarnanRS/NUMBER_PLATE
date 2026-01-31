# 🚀 Deployment Guide - Vehicle Registration System

This guide provides step-by-step instructions for deploying the backend to **Render** and the frontend to **Vercel**.

---

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Backend Deployment (Render)](#backend-deployment-render)
- [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
- [Post-Deployment Configuration](#post-deployment-configuration)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**Project Structure:**
```
reg-number-plate/
├── reg-backend/          # Node.js + Express + MongoDB backend
│   ├── src/
│   │   └── index.js      # Main server file
│   ├── package.json
│   └── .env.example
└── reg-frontend/         # React + Vite frontend
    ├── src/
    ├── package.json
    └── .env.example
```

**Tech Stack:**
- **Backend**: Node.js, Express, MongoDB Atlas, JWT Authentication
- **Frontend**: React, Vite, React Router, Axios
- **Database**: MongoDB Atlas (already configured)

---

## ✅ Prerequisites

Before deploying, ensure you have:

1. **GitHub Account** - Your code should be pushed to a GitHub repository
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
4. **MongoDB Atlas** - Already configured (connection string in `.env`)

---

## 🔧 Backend Deployment (Render)

### Step 1: Prepare Backend for Deployment

1. **Verify package.json scripts** (already configured):
   ```json
   "scripts": {
     "start": "node src/index.js",
     "dev": "nodemon src/index.js"
   }
   ```

2. **Ensure .gitignore includes**:
   ```
   node_modules
   .env
   ```

3. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### Step 2: Create Web Service on Render

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Click **"New +"** → **"Web Service"**

2. **Connect GitHub Repository**
   - Click **"Connect account"** to link your GitHub
   - Select your repository: `reg-number-plate`
   - Click **"Connect"**

3. **Configure Web Service**
   - **Name**: `reg-backend` (or your preferred name)
   - **Region**: Choose closest to your users (e.g., Singapore, Oregon)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `reg-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` (or paid plan for better performance)

### Step 3: Configure Environment Variables

In the **Environment Variables** section, add:

| Key | Value |
|-----|-------|
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://rssasivarnan_db_user:sasivarnan@cluster0.bfkp4js.mongodb.net/reg-number?retryWrites=true&w=majority` |
| `JWT_SECRET` | `cyberpunk_secret_key_2077` (or generate a secure random string) |
| `NODE_ENV` | `production` |

**⚠️ Important Notes:**
- Never commit `.env` files to GitHub
- Use strong, unique values for `JWT_SECRET` in production
- Ensure MongoDB Atlas allows connections from Render's IP addresses

### Step 4: Deploy Backend

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Start your server
3. Wait for deployment to complete (usually 2-5 minutes)
4. You'll receive a URL like: `https://reg-backend.onrender.com`

### Step 5: Verify Backend Deployment

1. **Test the root endpoint**:
   - Visit: `https://reg-backend.onrender.com/`
   - You should see: "Cyberpunk Registration API - Backend is online"

2. **Test API endpoints**:
   ```bash
   # Test vehicle types endpoint
   curl https://reg-backend.onrender.com/api/vehicle-types
   ```

### Step 6: Configure MongoDB Atlas Network Access

1. **Go to MongoDB Atlas Dashboard**
   - Navigate to **Network Access**
   - Click **"Add IP Address"**
   - Select **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Or add Render's specific IP ranges for better security

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Deployment

1. **Update environment variable for production**:
   - Create `.env.production` in `reg-frontend/`:
   ```env
   VITE_API_URL=https://reg-backend.onrender.com/api
   ```
   Replace with your actual Render backend URL.

2. **Verify build works locally**:
   ```bash
   cd reg-frontend
   npm run build
   ```

3. **Ensure .gitignore includes**:
   ```
   node_modules
   dist
   .env
   .env.local
   .env.production
   ```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from frontend directory**:
   ```bash
   cd reg-frontend
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? `reg-number-plate` (or your choice)
   - In which directory is your code located? `./`
   - Want to override settings? **Y**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Development Command: `npm run dev`

5. **Set environment variables**:
   ```bash
   vercel env add VITE_API_URL production
   ```
   Enter: `https://reg-backend.onrender.com/api`

6. **Deploy to production**:
   ```bash
   vercel --prod
   ```

#### Option B: Using Vercel Dashboard

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click **"Add New..."** → **"Project"**

2. **Import Git Repository**
   - Click **"Import Git Repository"**
   - Select your `reg-number-plate` repository
   - Click **"Import"**

3. **Configure Project**
   - **Framework Preset**: `Vite`
   - **Root Directory**: `reg-frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   - Click **"Environment Variables"**
   - Add:
     - **Key**: `VITE_API_URL`
     - **Value**: `https://reg-backend.onrender.com/api`
     - **Environment**: Production, Preview, Development

5. **Deploy**
   - Click **"Deploy"**
   - Wait for deployment (usually 1-3 minutes)
   - You'll receive a URL like: `https://reg-number-plate.vercel.app`

### Step 3: Verify Frontend Deployment

1. **Visit your Vercel URL**
2. **Test the application**:
   - Landing page should load
   - Try registering/logging in
   - Check browser console for any errors

---

## 🔄 Post-Deployment Configuration

### Update CORS Settings (Backend)

If you encounter CORS errors, update `reg-backend/src/index.js`:

```javascript
// Update CORS configuration
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://reg-number-plate.vercel.app',  // Add your Vercel URL
        'https://your-custom-domain.com'         // Add custom domain if any
    ],
    credentials: true
}));
```

Then redeploy the backend on Render (it will auto-deploy if connected to GitHub).

### Set Up Custom Domain (Optional)

#### For Vercel (Frontend):
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

#### For Render (Backend):
1. Go to your service → Settings → Custom Domain
2. Add your custom domain
3. Update DNS records as instructed

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: "Application failed to respond"
- **Solution**: Check Render logs for errors
- Verify MongoDB connection string is correct
- Ensure MongoDB Atlas allows Render's IP addresses

**Problem**: "Cannot connect to MongoDB"
- **Solution**: 
  - Check MongoDB Atlas Network Access settings
  - Verify connection string in environment variables
  - Ensure database name is correct in the URI

**Problem**: "Module not found"
- **Solution**: Ensure all dependencies are in `package.json` (not devDependencies)

### Frontend Issues

**Problem**: "Failed to fetch" or CORS errors
- **Solution**: 
  - Verify `VITE_API_URL` environment variable is set correctly
  - Update CORS settings in backend
  - Check browser console for exact error

**Problem**: "404 on page refresh"
- **Solution**: Vercel automatically handles this for SPAs, but verify:
  - Create `vercel.json` in `reg-frontend/`:
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```

**Problem**: Environment variables not working
- **Solution**: 
  - Ensure variables start with `VITE_`
  - Redeploy after adding environment variables
  - Check Vercel project settings

### General Issues

**Problem**: Changes not reflecting
- **Solution**: 
  - Clear browser cache
  - Force redeploy on Vercel/Render
  - Check if correct branch is deployed

---

## 📝 Deployment Checklist

### Before Deployment
- [ ] Code pushed to GitHub
- [ ] `.env` files not committed
- [ ] MongoDB Atlas configured and accessible
- [ ] Local build successful (`npm run build`)

### Backend (Render)
- [ ] Web Service created
- [ ] Root directory set to `reg-backend`
- [ ] Environment variables configured
- [ ] Deployment successful
- [ ] API endpoints responding

### Frontend (Vercel)
- [ ] Project imported/deployed
- [ ] Root directory set to `reg-frontend`
- [ ] `VITE_API_URL` environment variable set
- [ ] Build successful
- [ ] Application loads and functions correctly

### Post-Deployment
- [ ] CORS configured correctly
- [ ] All features tested in production
- [ ] Error monitoring set up (optional)
- [ ] Custom domains configured (optional)

---

## 🔗 Useful Links

- **Render Documentation**: https://render.com/docs
- **Vercel Documentation**: https://vercel.com/docs
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **Vite Environment Variables**: https://vitejs.dev/guide/env-and-mode.html

---

## 🎉 Success!

Your application should now be live:
- **Backend API**: `https://reg-backend.onrender.com`
- **Frontend App**: `https://reg-number-plate.vercel.app`

**Note**: Render's free tier may spin down after inactivity. The first request after inactivity may take 30-60 seconds to respond.

---

## 📧 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Render/Vercel logs
3. Verify all environment variables
4. Test API endpoints individually

Good luck with your deployment! 🚀
