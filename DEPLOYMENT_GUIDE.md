# Production Deployment Guide

## 🚀 Deployment to Render.com

### Prerequisites
- GitHub account (✅ Done - repo created)
- Render.com account (create free at https://render.com)
- MongoDB Atlas (✅ Already configured)

---

## 📦 Deployment Steps

### 1️⃣ Deploy Backend Server (Node.js)

**Go to Render Dashboard:**
1. Visit https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `wasiahamad/Portfolio`
4. Configure:
   - **Name**: `portfolio-server`
   - **Region**: Oregon (US West) or closest to you
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. **Environment Variables** - Add these:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://mdwasia98_db_user:RB67DyV7vdcrPv9G@cluster0.fhcevqv.mongodb.net/?appName=Cluster0
   JWT_SECRET=your_jwt_secret_key_here_change_in_production_2024
   EMAIL_USER=mdwasia98@gmail.com
   EMAIL_PASSWORD=xxliueonjmleajkq
   ADMIN_EMAIL=mdwasia98@gmail.com
   ADMIN_NAME=Md Wasi Ahmad
   ADMIN_EMAIL_SEED=mdwasia98@gmail.com
   ADMIN_PASSWORD=Wasi@Faiqua9661
   NODE_ENV=production
   ```

6. Click "Create Web Service"
7. **Note the URL**: Will be like `https://portfolio-server-xxxx.onrender.com`

---

### 2️⃣ Deploy Client (React/Vite)

**Create New Web Service:**
1. Click "New +" → "Web Service"
2. Select `wasiahamad/Portfolio` repository
3. Configure:
   - **Name**: `portfolio-client`
   - **Region**: Same as server
   - **Branch**: `main`
   - **Root Directory**: `Client`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview` or use static site
   - **Instance Type**: Free

4. **Environment Variables**:
   ```
   VITE_API_URL=https://portfolio-server-xxxx.onrender.com/api
   NODE_ENV=production
   ```
   (Replace with your actual server URL from step 1)

5. Click "Create Web Service"
6. **Note the URL**: Will be like `https://portfolio-client-xxxx.onrender.com`

---

### 3️⃣ Deploy Admin Panel

**Create New Web Service:**
1. Click "New +" → "Web Service"
2. Select `wasiahamad/Portfolio` repository
3. Configure:
   - **Name**: `portfolio-admin`
   - **Region**: Same as server
   - **Branch**: `main`
   - **Root Directory**: `admin`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview`
   - **Instance Type**: Free

4. **Environment Variables**:
   ```
   VITE_API_URL=https://portfolio-server-xxxx.onrender.com/api
   NODE_ENV=production
   ```
   (Replace with your actual server URL from step 1)

5. Click "Create Web Service"
6. **Note the URL**: Will be like `https://portfolio-admin-xxxx.onrender.com`

---

## 🔧 Alternative: Deploy to Vercel (Recommended for Frontend)

### Deploy Client & Admin to Vercel:

1. **Install Vercel CLI**:
   ```powershell
   npm install -g vercel
   ```

2. **Deploy Client**:
   ```powershell
   cd Client
   vercel --prod
   ```
   Follow prompts, set environment variable:
   - `VITE_API_URL`: Your server URL

3. **Deploy Admin**:
   ```powershell
   cd ../admin
   vercel --prod
   ```
   Follow prompts, set same environment variable

---

## 🔄 Update CORS in Server

After deployment, update server CORS to allow your deployed domains:

**File**: `server/index.js`

```javascript
app.use(cors({
  origin: [
    'http://localhost:5001',
    'http://localhost:3000',
    'https://portfolio-client-xxxx.onrender.com',
    'https://portfolio-admin-xxxx.onrender.com',
    // Add your actual deployed URLs here
  ],
  credentials: true
}));
```

Then commit and push changes:
```powershell
git add .
git commit -m "Update CORS for production"
git push origin main
```

---

## 📝 Final URLs to Add in .env Files

### Client `.env.production`:
```env
VITE_API_URL=https://your-server-url.onrender.com/api
```

### Admin `.env.production`:
```env
VITE_API_URL=https://your-server-url.onrender.com/api
```

### Server `.env` (already configured):
```env
# Already set in Render dashboard
```

---

## ✅ Post-Deployment Checklist

- [ ] Server deployed and running
- [ ] Client deployed and accessible
- [ ] Admin panel deployed and accessible
- [ ] CORS updated with production URLs
- [ ] Environment variables set correctly
- [ ] Database connected (check server logs)
- [ ] Admin login working
- [ ] Contact form sending emails
- [ ] API endpoints responding

---

## 🌐 Your Live URLs

After deployment, you'll have:
- **Client**: `https://portfolio-client-xxxx.onrender.com`
- **Admin**: `https://portfolio-admin-xxxx.onrender.com`
- **Server API**: `https://portfolio-server-xxxx.onrender.com/api`

---

## 🎯 Quick Deploy Commands

```powershell
# Update and redeploy
git add .
git commit -m "Update for production"
git push origin main

# Render will auto-deploy on push
```

---

## 🐛 Troubleshooting

**Server not starting?**
- Check environment variables in Render dashboard
- Check server logs in Render
- Verify MongoDB connection string

**Client/Admin not loading?**
- Check build logs
- Verify VITE_API_URL is correct
- Check browser console for errors

**CORS errors?**
- Update server CORS settings
- Restart server service in Render

---

## 💡 Tips

1. **Free Tier Limitations**:
   - Services sleep after 15 mins of inactivity
   - First request may be slow (cold start)
   - Consider upgrading for production use

2. **Custom Domain**:
   - Add custom domain in Render dashboard
   - Update DNS settings
   - Update CORS and env files

3. **Monitoring**:
   - Check Render logs regularly
   - Set up uptime monitoring (UptimeRobot)
   - Monitor MongoDB usage

---

**Need Help?** Check Render docs: https://render.com/docs
