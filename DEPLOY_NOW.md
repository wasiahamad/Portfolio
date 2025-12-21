# 🚀 Quick Deployment Guide - Portfolio

## ✅ Git Repository Setup - DONE!
Repository: https://github.com/wasiahamad/Portfolio

---

## 📋 Step-by-Step Deployment (Choose One Method)

### Method 1: Render.com (Recommended - All in One)

#### 1. Create Render Account
- Go to https://render.com
- Sign up with GitHub
- Connect your repository: `wasiahamad/Portfolio`

#### 2. Deploy Server (Backend)
```
Service Type: Web Service
Name: portfolio-server
Root Directory: server
Build Command: npm install
Start Command: npm start
Environment Variables (copy-paste):
  PORT=5000
  MONGODB_URI=mongodb+srv://mdwasia98_db_user:RB67DyV7vdcrPv9G@cluster0.fhcevqv.mongodb.net/?appName=Cluster0
  JWT_SECRET=portfolio_jwt_secret_production_2024_secure
  EMAIL_USER=mdwasia98@gmail.com
  EMAIL_PASSWORD=xxliueonjmleajkq
  ADMIN_EMAIL=mdwasia98@gmail.com
  ADMIN_NAME=Md Wasi Ahmad
  ADMIN_EMAIL_SEED=mdwasia98@gmail.com
  ADMIN_PASSWORD=Wasi@Faiqua9661
  NODE_ENV=production
```

**After Deploy, Copy Server URL**: `https://portfolio-server-XXXX.onrender.com`

#### 3. Deploy Client (Frontend)
```
Service Type: Static Site
Name: portfolio-client
Root Directory: Client
Build Command: npm install && npm run build
Publish Directory: dist
Environment Variables:
  VITE_API_URL=https://portfolio-server-XXXX.onrender.com/api
```
(Replace XXXX with your server URL)

**Copy Client URL**: `https://portfolio-client-XXXX.onrender.com`

#### 4. Deploy Admin Panel
```
Service Type: Static Site
Name: portfolio-admin
Root Directory: admin
Build Command: npm install && npm run build
Publish Directory: dist
Environment Variables:
  VITE_API_URL=https://portfolio-server-XXXX.onrender.com/api
```

**Copy Admin URL**: `https://portfolio-admin-XXXX.onrender.com`

#### 5. Update Server CORS
Go back to Render Server dashboard → Environment → Add:
```
CLIENT_URL=https://portfolio-client-XXXX.onrender.com
ADMIN_URL=https://portfolio-admin-XXXX.onrender.com
```

---

### Method 2: Vercel (Alternative - Frontend Only)

#### For Server - Use Render or Railway
Follow Server deployment from Method 1

#### For Client & Admin - Use Vercel

1. **Install Vercel CLI**:
```powershell
npm install -g vercel
```

2. **Deploy Client**:
```powershell
cd "c:\Users\HP\OneDrive\Desktop\Persional Portfolio\Client"
vercel --prod
```
When prompted:
- Link to existing project? No
- Project name: portfolio-client
- Environment variables: `VITE_API_URL=YOUR_SERVER_URL/api`

3. **Deploy Admin**:
```powershell
cd "c:\Users\HP\OneDrive\Desktop\Persional Portfolio\admin"
vercel --prod
```
When prompted:
- Project name: portfolio-admin
- Environment variables: `VITE_API_URL=YOUR_SERVER_URL/api`

---

## 🔄 After Deployment - Update URLs

### Update These Files Locally:

**Client/.env.production**:
```env
VITE_API_URL=https://your-actual-server-url.onrender.com/api
```

**admin/.env.production**:
```env
VITE_API_URL=https://your-actual-server-url.onrender.com/api
```

### Commit Changes:
```powershell
cd "c:\Users\HP\OneDrive\Desktop\Persional Portfolio"
git add .
git commit -m "Add production URLs"
git push origin main
```

Render/Vercel will auto-redeploy!

---

## 🌐 Your Live Portfolio

After deployment you'll have:

| Service | URL | Purpose |
|---------|-----|---------|
| **Client** | `https://portfolio-client-xxxx.onrender.com` | Public Portfolio Website |
| **Admin** | `https://portfolio-admin-xxxx.onrender.com` | Admin Dashboard |
| **Server** | `https://portfolio-server-xxxx.onrender.com` | Backend API |

### Admin Login:
- Email: `mdwasia98@gmail.com`
- Password: `Wasi@Faiqua9661`

---

## ✅ Deployment Checklist

- [ ] Server deployed on Render
- [ ] Client deployed on Render/Vercel
- [ ] Admin deployed on Render/Vercel
- [ ] Environment variables set
- [ ] CORS configured with production URLs
- [ ] Test admin login
- [ ] Test contact form
- [ ] Test all API endpoints
- [ ] MongoDB connected (check server logs)

---

## 🐛 Common Issues

**500 Error on Server?**
- Check environment variables
- Check server logs in Render
- Verify MongoDB connection string

**Client can't connect to API?**
- Check VITE_API_URL is correct
- Check browser console for CORS errors
- Ensure server CORS includes client URL

**Admin login not working?**
- Check API URL in admin .env
- Verify admin credentials in server env
- Check network tab in browser

---

## 💡 Free Tier Notes

**Render Free Tier**:
- Services sleep after 15 min inactivity
- First request takes ~30s (cold start)
- 750 hours/month free

**Vercel Free Tier**:
- Unlimited deployments
- 100 GB bandwidth/month
- Instant wake-up (no cold start)

---

## 🎯 Next Steps After Deployment

1. **Test Everything**:
   - Visit client URL
   - Login to admin panel
   - Add a project/blog
   - Test contact form

2. **Custom Domain** (Optional):
   - Buy domain from Namecheap/GoDaddy
   - Add to Render/Vercel
   - Update DNS settings

3. **Monitoring**:
   - Set up UptimeRobot for monitoring
   - Check logs regularly
   - Monitor MongoDB usage

---

**🎉 That's it! Your portfolio is now LIVE on the internet!**

Share your links:
- Portfolio: `your-client-url`
- Admin: `your-admin-url`
