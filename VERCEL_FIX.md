# 🔧 Vercel Deployment Fix

## Problem
Vercel is building from the root directory instead of `reg-frontend`, causing the error:
```
npm error Missing script: "build"
```

## Solution: Deploy from Frontend Directory

### Method 1: Vercel Dashboard (Easiest)

1. **Go to Project Settings**:
   ```
   Vercel Dashboard → Your Project → Settings → General
   ```

2. **Update Root Directory**:
   - Find "Root Directory" section
   - Click "Edit"
   - Enter: `reg-frontend`
   - Click "Save"

3. **Redeploy**:
   ```
   Deployments → Latest → ⋯ → Redeploy
   ```

---

### Method 2: Vercel CLI (From Frontend Directory)

```bash
# Navigate to frontend directory
cd reg-frontend

# Login to Vercel
vercel login

# Deploy from this directory
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? [Your account]
# - Link to existing project? N (or Y if you want to link)
# - Project name? reg-number-plate-frontend
# - In which directory is your code located? ./ (current directory)
# - Want to override settings? Y
#   - Build Command: npm run build
#   - Output Directory: dist
#   - Development Command: npm run dev

# Add environment variable
vercel env add VITE_API_URL production
# Enter: https://your-backend.onrender.com/api

# Deploy to production
vercel --prod
```

---

### Method 3: Create vercel.json in Root

Add this to the **root** `vercel.json`:

```json
{
  "buildCommand": "cd reg-frontend && npm install && npm run build",
  "outputDirectory": "reg-frontend/dist",
  "installCommand": "cd reg-frontend && npm install"
}
```

But **Method 1 or 2 is better** - cleaner and more maintainable.

---

## Recommended Approach

**Use Method 2 (CLI from frontend directory)** - it's the cleanest:

```bash
cd c:\project\reg-number-plate\reg-frontend
vercel --prod
```

This ensures Vercel knows to build from the frontend directory.

---

## After Fixing

You should see:
```
✓ Build Completed
✓ Deployment ready
🔗 https://your-app.vercel.app
```

---

## Verification

1. Visit your Vercel URL
2. Check that the app loads
3. Test login/registration
4. Verify API calls work (check Network tab)

---

**Choose Method 1 (Dashboard) or Method 2 (CLI) - both work perfectly!** 🚀
