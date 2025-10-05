# 🚀 XRPotato Deployment Guide for Render

Complete step-by-step guide to deploy your full-stack application on Render with custom domain.

## 📋 Prerequisites

✅ You have:
- A GitHub repository (this one!)
- A custom domain purchased
- A Supabase account with PostgreSQL database
- Auth0 account (if using authentication)

---

## 🎯 Deployment Steps Overview

1. **Prepare Your Repository** ✅ (Already done!)
2. **Deploy Backend API**
3. **Deploy Frontend**
4. **Configure Custom Domain**
5. **Set Environment Variables**
6. **Test Deployment**

---

## Step 1: Prepare Repository (✅ Done!)

We've already:
- Created `render.yaml` blueprint file
- Added API configuration to use environment variables
- Updated API calls in Dashboard and Submit pages

### Commit and push these changes:

```bash
git add .
git commit -m "Configure for Render deployment"
git push origin main
```

---

## Step 2: Deploy Backend API on Render

### 2.1 Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository:
   - If first time: **"Connect account"** → Authorize Render
   - Select your repository: `XRPotato`

### 2.2 Configure Backend Service

Fill in the following settings:

| Setting | Value |
|---------|-------|
| **Name** | `xrpotato-backend` (or your preferred name) |
| **Region** | Choose closest to your users |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` or `Starter` ($7/month recommended) |

### 2.3 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add these:

#### Required Variables:

```bash
NODE_ENV=production
PORT=3001

# Database - Get from Supabase
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# JWT Secret - Generate a random string
JWT_SECRET=your-super-secret-random-string-here

# XRPL Configuration
XRPL_NETWORK=testnet
XRPL_JSONRPC=https://s.altnet.rippletest.net:51234/
```

#### Optional Variables (add if you're using these services):

```bash
# Auth0 (for API authentication)
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_AUDIENCE=https://your-api.com/api

# XRPL Wallet (for testnet only!)
PLATFORM_HOT_WALLET_SEED=sXXXXXXXXXXXXXXXX
```

**🔒 Security Note:** Never expose real wallet seeds. Use testnet wallets only!

### 2.4 Get Your Supabase Connection String

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **Database**
4. Find **Connection String** → **URI**
5. Copy and replace `[YOUR-PASSWORD]` with your database password
6. Paste it as `DATABASE_URL` in Render

### 2.5 Deploy Backend

1. Click **"Create Web Service"**
2. Wait for deployment (takes 2-5 minutes)
3. Once deployed, you'll see a URL like: `https://xrpotato-backend.onrender.com`
4. **📝 Save this URL** - you'll need it for frontend!

### 2.6 Test Backend

Visit these URLs to verify:
- Health check: `https://xrpotato-backend.onrender.com/health`
- API test: `https://xrpotato-backend.onrender.com/api/test`
- DB test: `https://xrpotato-backend.onrender.com/api/db-test`

All should return JSON responses!

---

## Step 3: Deploy Frontend on Render

### 3.1 Create Static Site

1. In Render Dashboard: **"New +"** → **"Static Site"**
2. Select your repository: `XRPotato`

### 3.2 Configure Frontend Service

| Setting | Value |
|---------|-------|
| **Name** | `xrpotato-frontend` (or your preferred name) |
| **Branch** | `main` |
| **Root Directory** | Leave empty (root of repo) |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

### 3.3 Add Frontend Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**:

```bash
NODE_ENV=production

# Your Backend API URL (from Step 2.5)
VITE_API_URL=https://xrpotato-backend.onrender.com

# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your_auth0_client_id
VITE_AUTH0_AUDIENCE=https://your-api.com/api
```

**Important:** Replace `https://xrpotato-backend.onrender.com` with YOUR actual backend URL from Step 2.5!

### 3.4 Add Redirect Rules for SPA

Scroll down to **"Redirects/Rewrites"** section:

| Source | Destination | Action |
|--------|-------------|--------|
| `/*` | `/index.html` | Rewrite |

This ensures React Router works correctly on page refreshes.

### 3.5 Deploy Frontend

1. Click **"Create Static Site"**
2. Wait for deployment (takes 3-7 minutes)
3. Once deployed, you'll see a URL like: `https://xrpotato-frontend.onrender.com`

### 3.6 Test Frontend

1. Visit your frontend URL
2. You should see your landing page
3. Try navigating to different pages
4. Test paper submission and dashboard (if auth is configured)

---

## Step 4: Connect Custom Domain

### 4.1 Add Custom Domain to Frontend

1. In your **frontend** service on Render
2. Go to **"Settings"** tab
3. Scroll to **"Custom Domains"**
4. Click **"Add Custom Domain"**
5. Enter your domain (e.g., `xrpotato.com` or `www.xrpotato.com`)

### 4.2 Configure DNS Records

Render will show you DNS records to add. Go to your domain registrar:

#### For Root Domain (xrpotato.com):

Add these records:

| Type | Name | Value |
|------|------|-------|
| `A` | `@` | `76.76.21.21` |
| `AAAA` | `@` | `2600:1f18:21ab:e400::10` |

#### For www Subdomain:

| Type | Name | Value |
|------|------|-------|
| `CNAME` | `www` | `xrpotato-frontend.onrender.com` |

**Note:** DNS propagation can take 1-48 hours (usually 15 minutes).

### 4.3 SSL Certificate

Render automatically provisions SSL certificates via Let's Encrypt:
- Takes 5-15 minutes after DNS propagates
- Your site will be accessible via `https://yourdomain.com`

### 4.4 Update Auth0 Callback URLs (if using Auth0)

1. Go to [Auth0 Dashboard](https://auth0.com/dashboard)
2. Select your application
3. Go to **Settings**
4. Update these fields:

**Allowed Callback URLs:**
```
https://yourdomain.com,
https://xrpotato-frontend.onrender.com
```

**Allowed Logout URLs:**
```
https://yourdomain.com,
https://xrpotato-frontend.onrender.com
```

**Allowed Web Origins:**
```
https://yourdomain.com,
https://xrpotato-frontend.onrender.com
```

5. Save Changes

---

## Step 5: Configure CORS in Backend

Make sure your backend allows requests from your domain:

Add to `backend/server.js` (if not already there):

```javascript
app.use(cors({
  origin: [
    'http://localhost:8080',
    'https://xrpotato-frontend.onrender.com',
    'https://yourdomain.com',  // Add your custom domain
    'https://www.yourdomain.com'  // If using www
  ],
  credentials: true
}));
```

Then redeploy backend:
1. Push changes to GitHub
2. Render will auto-deploy

---

## Step 6: Final Testing

### 6.1 Test All Functionality

Visit your custom domain and test:

✅ Landing page loads
✅ Authentication works (if configured)
✅ Dashboard displays papers
✅ Submit paper functionality
✅ API calls work
✅ No CORS errors in browser console

### 6.2 Check Logs

If something doesn't work:

**Backend logs:**
1. Go to your backend service on Render
2. Click **"Logs"** tab
3. Check for errors

**Frontend logs:**
1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab for failed API calls

---

## 🔧 Environment Variables Summary

### Frontend (.env)
```bash
VITE_API_URL=https://your-backend.onrender.com
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your_client_id
VITE_AUTH0_AUDIENCE=https://your-api.com/api
```

### Backend (.env)
```bash
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...supabase...
JWT_SECRET=random-secret-string
XRPL_NETWORK=testnet
XRPL_JSONRPC=https://s.altnet.rippletest.net:51234/
```

---

## 🚨 Common Issues & Solutions

### Issue: "Failed to fetch" errors

**Solution:** 
- Check CORS configuration in backend
- Verify `VITE_API_URL` is set correctly
- Check backend is running (visit `/health` endpoint)

### Issue: Pages return 404 on refresh

**Solution:**
- Verify redirect rule: `/* → /index.html` (Rewrite)
- Redeploy frontend if needed

### Issue: Database connection errors

**Solution:**
- Verify `DATABASE_URL` is correct
- Check Supabase firewall allows Render IPs
- Run migrations: Visit `/api/db-test` to verify connection

### Issue: SSL certificate not provisioning

**Solution:**
- Wait 15-30 minutes after DNS propagates
- Verify DNS records are correct
- Check domain registrar settings

### Issue: Auth0 errors

**Solution:**
- Verify callback URLs include your domain
- Check Auth0 environment variables
- Clear browser cookies and try again

---

## 📊 Monitoring & Maintenance

### Free Tier Limitations
- Backend services on free tier **spin down after 15 minutes** of inactivity
- First request after spindown takes 30-60 seconds
- Consider upgrading to Starter plan ($7/month) for always-on

### Automatic Deploys
Render automatically deploys when you push to `main`:
1. Edit code locally
2. `git push origin main`
3. Render builds and deploys automatically

### Database Backups
- Supabase automatically backs up your database
- Configure additional backups in Supabase dashboard

---

## 🎉 Success!

Your XRPotato app should now be live at:
- **Frontend:** https://yourdomain.com
- **Backend API:** https://your-backend.onrender.com
- **Database:** Hosted on Supabase

### Next Steps:
1. ✅ Monitor application performance
2. ✅ Set up Sentry or logging service
3. ✅ Configure production XRPL wallet
4. ✅ Add monitoring/analytics
5. ✅ Set up CI/CD workflows

---

## 📞 Support

- **Render Docs:** https://render.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **XRPL Docs:** https://xrpl.org/docs.html

---

**Deployed successfully?** 🎊 Share your live link and start revolutionizing academic publishing!
