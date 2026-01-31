# 🏗️ Deployment Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│                     (Desktop/Mobile/Tablet)                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VERCEL (Frontend Hosting)                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │         React Application (Vite Build)                    │  │
│  │  • Landing Page                                           │  │
│  │  • Authentication Pages                                   │  │
│  │  • Dashboard                                              │  │
│  │  • Registration Pages                                     │  │
│  │  • Admin Panel                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  URL: https://reg-number-plate.vercel.app                       │
│  CDN: Global Edge Network                                       │
│  SSL: Automatic (Let's Encrypt)                                 │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             │ API Calls (HTTPS)
                             │ axios requests
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RENDER (Backend Hosting)                     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │         Node.js + Express Server                          │  │
│  │                                                            │  │
│  │  API Endpoints:                                           │  │
│  │  • POST /api/auth/register                                │  │
│  │  • POST /api/auth/login                                   │  │
│  │  • GET  /api/registrations                                │  │
│  │  • POST /api/registrations                                │  │
│  │  • GET  /api/vehicle-types                                │  │
│  │  • GET  /api/history                                      │  │
│  │  • GET  /api/users (admin)                                │  │
│  │                                                            │  │
│  │  Middleware:                                              │  │
│  │  • CORS (configured)                                      │  │
│  │  • JWT Authentication                                     │  │
│  │  • Body Parser                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  URL: https://reg-backend.onrender.com                          │
│  Region: Auto-selected                                          │
│  SSL: Automatic                                                 │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             │ MongoDB Protocol
                             │ mongoose connection
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  MongoDB Atlas (Database)                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │         Database: reg-number                              │  │
│  │                                                            │  │
│  │  Collections:                                             │  │
│  │  • users          - User accounts & authentication        │  │
│  │  • registrations  - Vehicle registrations                 │  │
│  │  • vehicletypes   - Vehicle type definitions              │  │
│  │  • histories      - Activity logs                         │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Cluster: cluster0.bfkp4js.mongodb.net                          │
│  Region: Auto-selected                                          │
│  Tier: M0 (Free)                                                │
│  Storage: 512MB                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Registration Flow
```
User Browser
    │
    ├─→ Vercel (Frontend)
    │       │
    │       └─→ POST /api/auth/register
    │               │
    │               └─→ Render (Backend)
    │                       │
    │                       ├─→ Hash password (bcrypt)
    │                       │
    │                       └─→ MongoDB Atlas
    │                               │
    │                               └─→ Save user
    │                                       │
    │                                       └─→ Return JWT token
    │                                               │
    │                                               └─→ Frontend stores token
    │                                                       │
    └───────────────────────────────────────────────────────┘
```

### 2. Vehicle Registration Flow
```
Authenticated User
    │
    ├─→ Vercel (Frontend)
    │       │
    │       └─→ POST /api/registrations
    │           (with JWT token)
    │               │
    │               └─→ Render (Backend)
    │                       │
    │                       ├─→ Verify JWT token
    │                       │
    │                       └─→ MongoDB Atlas
    │                               │
    │                               ├─→ Save registration
    │                               │
    │                               ├─→ Update user history
    │                               │
    │                               └─→ Save global history
    │                                       │
    │                                       └─→ Return registration data
    │                                               │
    └───────────────────────────────────────────────┘
```

## Environment Variables Flow

### Development (Local)
```
reg-frontend/.env
    VITE_API_URL=http://localhost:5000/api
    │
    └─→ Points to local backend

reg-backend/.env
    PORT=5000
    MONGODB_URI=mongodb+srv://...
    JWT_SECRET=cyberpunk_secret_key_2077
```

### Production (Deployed)
```
Vercel Environment Variables
    VITE_API_URL=https://reg-backend.onrender.com/api
    │
    └─→ Points to production backend

Render Environment Variables
    PORT=5000
    MONGODB_URI=mongodb+srv://...
    JWT_SECRET=cyberpunk_secret_key_2077
    NODE_ENV=production
```

## Security Layers

```
┌─────────────────────────────────────────┐
│  1. HTTPS/TLS Encryption                │
│     • All traffic encrypted             │
│     • Automatic SSL certificates        │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  2. CORS Protection                     │
│     • Whitelisted origins only          │
│     • Credentials support               │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  3. JWT Authentication                  │
│     • Token-based auth                  │
│     • Expiration handling               │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  4. Password Hashing                    │
│     • bcrypt with salt rounds           │
│     • Never store plain passwords       │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  5. MongoDB Atlas Security              │
│     • Network access control            │
│     • Database user authentication      │
│     • Encrypted connections             │
└─────────────────────────────────────────┘
```

## Deployment Pipeline

### Backend (Render)
```
GitHub Repository
    │
    ├─→ Push to main branch
    │
    └─→ Render Webhook Triggered
            │
            ├─→ Clone repository
            │
            ├─→ Install dependencies (npm install)
            │
            ├─→ Start server (npm start)
            │
            └─→ Health check
                    │
                    └─→ Deploy successful ✓
```

### Frontend (Vercel)
```
GitHub Repository
    │
    ├─→ Push to main branch
    │
    └─→ Vercel Webhook Triggered
            │
            ├─→ Clone repository
            │
            ├─→ Install dependencies (npm install)
            │
            ├─→ Build application (npm run build)
            │
            ├─→ Optimize assets
            │
            ├─→ Deploy to CDN
            │
            └─→ Deploy successful ✓
```

## Network Architecture

```
                    Internet
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
    Vercel CDN                   Render Server
    (Frontend)                    (Backend)
        │                             │
        │                             │
        │                             ▼
        │                      MongoDB Atlas
        │                        (Database)
        │                             │
        └─────────────────────────────┘
              API Communication
```

## Scaling Considerations

### Current Setup (Free Tier)
```
Frontend (Vercel Free)
    • Unlimited bandwidth
    • 100GB bandwidth/month
    • Global CDN
    • Automatic scaling

Backend (Render Free)
    • 750 hours/month
    • Spins down after 15 min inactivity
    • 512MB RAM
    • Single instance

Database (MongoDB Atlas M0)
    • 512MB storage
    • Shared cluster
    • Limited connections
```

### Future Scaling (Paid Tier)
```
Frontend (Vercel Pro)
    • Custom domains
    • Advanced analytics
    • Team collaboration

Backend (Render Starter)
    • Always on
    • More RAM/CPU
    • Multiple instances
    • Auto-scaling

Database (MongoDB Atlas M10+)
    • Dedicated cluster
    • More storage
    • Better performance
    • Automated backups
```

## Monitoring & Logs

### Vercel
```
Dashboard → Project → Deployments
    • Build logs
    • Runtime logs
    • Analytics
    • Performance metrics
```

### Render
```
Dashboard → Service → Logs
    • Application logs
    • System logs
    • Error tracking
    • Resource usage
```

### MongoDB Atlas
```
Dashboard → Cluster → Metrics
    • Connection stats
    • Query performance
    • Storage usage
    • Network traffic
```

## Backup Strategy

### Code
```
GitHub Repository
    • Version control
    • Commit history
    • Branch protection
```

### Database
```
MongoDB Atlas
    • Automatic backups (M10+)
    • Point-in-time recovery
    • Manual exports (M0)
```

### Environment Variables
```
Secure Storage
    • Password manager
    • Encrypted notes
    • Team vault
```

---

**This architecture provides:**
- ✅ High availability
- ✅ Automatic scaling
- ✅ Global CDN distribution
- ✅ Secure communication
- ✅ Easy deployment
- ✅ Cost-effective (free tier available)
