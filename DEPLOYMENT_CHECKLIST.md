# 🎯 Quick Deployment Checklist

Use this checklist to track your deployment progress!

## Before You Start
- [ ] Code pushed to GitHub
- [ ] Supabase database is set up and running
- [ ] Domain purchased and accessible

---

## Part 1: Backend Deployment (30 minutes)

### Step 1: Create Backend Service on Render
- [ ] Go to Render.com and sign in
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Configure settings:
  - Name: `xrpotato-backend`
  - Root Directory: `backend`
  - Build Command: `npm install`
  - Start Command: `npm start`

### Step 2: Add Backend Environment Variables
- [ ] `NODE_ENV=production`
- [ ] `PORT=3001`
- [ ] `DATABASE_URL` (from Supabase)
- [ ] `JWT_SECRET` (generate random string)
- [ ] `XRPL_NETWORK=testnet`
- [ ] `XRPL_JSONRPC=https://s.altnet.rippletest.net:51234/`
- [ ] `FRONTEND_URL` (add after frontend deployment)

### Step 3: Deploy & Test Backend
- [ ] Click "Create Web Service"
- [ ] Wait for deployment to complete
- [ ] Save backend URL: `____________________________`
- [ ] Test `/health` endpoint
- [ ] Test `/api/test` endpoint
- [ ] Test `/api/db-test` endpoint

---

## Part 2: Frontend Deployment (30 minutes)

### Step 4: Create Frontend Service on Render
- [ ] Click "New +" → "Static Site"
- [ ] Select same GitHub repository
- [ ] Configure settings:
  - Name: `xrpotato-frontend`
  - Build Command: `npm install && npm run build`
  - Publish Directory: `dist`

### Step 5: Add Frontend Environment Variables
- [ ] `NODE_ENV=production`
- [ ] `VITE_API_URL` (your backend URL from Step 3)
- [ ] `VITE_AUTH0_DOMAIN` (if using Auth0)
- [ ] `VITE_AUTH0_CLIENT_ID` (if using Auth0)
- [ ] `VITE_AUTH0_AUDIENCE` (if using Auth0)

### Step 6: Configure SPA Redirects
- [ ] Add redirect rule: `/* → /index.html` (Rewrite)

### Step 7: Deploy & Test Frontend
- [ ] Click "Create Static Site"
- [ ] Wait for deployment to complete
- [ ] Save frontend URL: `____________________________`
- [ ] Visit frontend URL and verify it loads
- [ ] Test navigation between pages
- [ ] Open DevTools and check for errors

---

## Part 3: Custom Domain Setup (15-60 minutes)

### Step 8: Add Domain to Render
- [ ] Go to frontend service settings
- [ ] Click "Custom Domains"
- [ ] Add your domain: `____________________________`

### Step 9: Configure DNS Records
Go to your domain registrar and add:

For root domain (example.com):
- [ ] A record: `@` → `76.76.21.21`
- [ ] AAAA record: `@` → `2600:1f18:21ab:e400::10`

For www subdomain:
- [ ] CNAME: `www` → `xrpotato-frontend.onrender.com`

### Step 10: Wait for DNS & SSL
- [ ] DNS propagation (15 min - 48 hours, usually 15 min)
- [ ] SSL certificate issued automatically
- [ ] Site accessible via https://yourdomain.com

---

## Part 4: Final Configuration (15 minutes)

### Step 11: Update Auth0 (if using)
- [ ] Add domain to Allowed Callback URLs
- [ ] Add domain to Allowed Logout URLs
- [ ] Add domain to Allowed Web Origins
- [ ] Save changes

### Step 12: Update Backend CORS
- [ ] Add `FRONTEND_URL` environment variable in backend
- [ ] Set value to `https://yourdomain.com`
- [ ] Backend will auto-redeploy

### Step 13: Final Testing
- [ ] Visit your custom domain
- [ ] Test authentication (if configured)
- [ ] Test paper submission
- [ ] Test dashboard
- [ ] Check browser console for errors
- [ ] Test on mobile device

---

## 🎉 Deployment Complete!

**Your URLs:**
- Production site: https://____________________________
- Backend API: https://____________________________
- Render dashboard: https://dashboard.render.com

**What's next?**
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Add analytics
- [ ] Share with users!

---

## 🆘 Need Help?

If you run into issues:
1. Check `DEPLOYMENT.md` for detailed instructions
2. Review logs in Render dashboard
3. Check browser DevTools console
4. Verify all environment variables are set correctly

**Common Issues:**
- 404 on page refresh → Check SPA redirect rule
- CORS errors → Verify CORS configuration and FRONTEND_URL
- API errors → Check backend logs and DATABASE_URL
- Slow first load → Free tier spins down, upgrade to Starter plan
