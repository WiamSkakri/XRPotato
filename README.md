# XRPotato Deployment Guide

Complete guide to deploy XRPotato to production with custom domain.

## Architecture

- **Frontend**: Vercel (React/Vite app)
- **Backend**: Render.com or Railway (Node.js/Express API)
- **Database**: Supabase PostgreSQL
- **Auth**: Auth0
- **Blockchain**: XRPL Testnet
- **Storage**: IPFS (Pinata/Web3.storage) + AWS S3

## Prerequisites

- GitHub account with this repository pushed
- Vercel account (free tier works)
- Render.com or Railway account (free tier works)
- Custom domain registered
- Supabase project with tables created
- Auth0 application configured

## Step 1: Deploy Backend to Render.com

### 1.1 Create New Web Service

1. Go to https://render.com/
2. Click "New +" then "Web Service"
3. Connect your GitHub repository
4. Configure service:
   - **Name**: xrpotato-api
   - **Region**: Choose closest to your users
   - **Branch**: main
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`

### 1.2 Add Environment Variables

In Render dashboard, add these environment variables:

```
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://postgres.xxxxx:[PASSWORD]@xxx.pooler.supabase.com:6543/postgres
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_AUDIENCE=https://xrpotato-api.com
XRPL_NETWORK=testnet
XRPL_JSONRPC=https://s.altnet.rippletest.net:51234/
```

Get your DATABASE_URL from Supabase:
1. Go to Project Settings > Database
2. Copy "Connection pooling" URI
3. Replace [PASSWORD] with your database password

### 1.3 Deploy

Click "Create Web Service" and wait for deployment to complete. Note your backend URL (e.g., `https://xrpotato-api.onrender.com`)

## Step 2: Deploy Frontend to Vercel

### 2.1 Import Project

1. Go to https://vercel.com/
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: dist

### 2.2 Add Environment Variables

In Vercel project settings > Environment Variables, add:

```
VITE_AUTH0_DOMAIN=dev-gjkdribjyvsvb0kt.us.auth0.com
VITE_AUTH0_CLIENT_ID=liIh5ipSzbndQPzF3eET5E0SSY36vTyq
VITE_AUTH0_AUDIENCE=https://xrpotato-api.com
VITE_API_URL=https://xrpotato-api.onrender.com
```

Replace `VITE_API_URL` with your actual Render backend URL.

### 2.3 Deploy

Click "Deploy" and wait for build to complete.

## Step 3: Connect Custom Domain

### 3.1 Add Domain in Vercel

1. Go to your Vercel project > Settings > Domains
2. Enter your domain (e.g., `xrpotato.com`)
3. Click "Add"
4. Vercel will show DNS records you need to configure

### 3.2 Configure DNS Records

Go to your domain registrar (GoDaddy, Namecheap, etc.) and add:

**For root domain (xrpotato.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

DNS propagation takes 5-60 minutes.

### 3.3 Enable HTTPS

Vercel automatically provisions SSL certificates. Wait a few minutes after DNS propagation.

## Step 4: Update Auth0 Configuration

1. Go to Auth0 Dashboard > Applications > Your App
2. Update these settings:

**Allowed Callback URLs:**
```
https://xrpotato.com/callback,
https://www.xrpotato.com/callback,
http://localhost:8080/callback
```

**Allowed Logout URLs:**
```
https://xrpotato.com,
https://www.xrpotato.com,
http://localhost:8080
```

**Allowed Web Origins:**
```
https://xrpotato.com,
https://www.xrpotato.com,
http://localhost:8080
```

**Allowed Origins (CORS):**
```
https://xrpotato.com,
https://www.xrpotato.com,
http://localhost:8080
```

3. Save Changes

## Step 5: Update Backend CORS

Update `backend/server.js` to allow your production domain:

```javascript
app.use(cors({
  origin: [
    'http://localhost:8080',
    'https://xrpotato.com',
    'https://www.xrpotato.com'
  ],
  credentials: true
}));
```

Commit and push changes. Render will auto-deploy.

## Step 6: Test Deployment

### 6.1 Health Check

Test backend API:
```bash
curl https://xrpotato-api.onrender.com/health
```

Should return: `{"status":"healthy"}`

### 6.2 Database Connection

Test database:
```bash
curl https://xrpotato-api.onrender.com/api/test-db
```

Should return connection success message.

### 6.3 Frontend

1. Visit `https://xrpotato.com`
2. Test login with Auth0
3. Try submitting a paper
4. Check browser console for errors

## Step 7: Monitor Deployment

### Backend Monitoring (Render)

- View logs: Render Dashboard > Logs
- Check metrics: CPU, memory usage
- Set up alerts for downtime

### Frontend Monitoring (Vercel)

- Analytics: Vercel Dashboard > Analytics
- Logs: Real-time function logs
- Speed insights: Performance metrics

## Troubleshooting

### "Network Error" when calling API

**Problem**: Frontend cannot reach backend

**Solutions**:
1. Verify `VITE_API_URL` in Vercel matches Render URL
2. Check backend CORS settings include production domain
3. Ensure backend is running (check Render logs)
4. Test API directly: `curl https://your-api.onrender.com/health`

### Auth0 Login Fails

**Problem**: Redirect loop or "callback not allowed"

**Solutions**:
1. Verify Auth0 callback URLs include exact production URLs
2. Check `VITE_AUTH0_DOMAIN` and `VITE_AUTH0_CLIENT_ID` are correct
3. Clear browser cache and cookies
4. Check Auth0 dashboard logs for detailed error

### Database Connection Timeout

**Problem**: Backend cannot connect to Supabase

**Solutions**:
1. Verify `DATABASE_URL` in Render is correct
2. Check Supabase project is not paused (free tier pauses after inactivity)
3. Test connection pooling URL vs direct connection
4. Check Supabase logs for connection attempts

### CSS/Assets Not Loading

**Problem**: 404 errors for static files

**Solutions**:
1. Verify build output directory is `dist`
2. Check `vite.config.ts` base path
3. Clear Vercel cache and rebuild
4. Check browser network tab for failed requests

### Backend Cold Starts (Render Free Tier)

**Problem**: First request takes 30+ seconds

**Solution**: Render free tier spins down after inactivity. Consider:
1. Upgrading to paid tier for always-on instances
2. Using a cron job to ping your API every 14 minutes
3. Adding loading states in frontend for initial requests

## Production Checklist

Before announcing your app:

- [ ] SSL certificate active (HTTPS working)
- [ ] Custom domain configured and propagated
- [ ] Auth0 production credentials configured
- [ ] Database has proper indexes on frequently queried columns
- [ ] Error tracking setup (Sentry recommended)
- [ ] Backup strategy for database
- [ ] API rate limiting configured
- [ ] XRPL mainnet credentials ready (if launching with real XRP)
- [ ] Terms of service and privacy policy pages created
- [ ] Contact/support email configured
- [ ] Performance tested with Lighthouse (score >90)
- [ ] Security headers configured (Helmet.js)
- [ ] CORS properly restricted to production domains only

## Cost Estimate (Monthly)

- **Vercel**: Free (Hobby tier, includes custom domain)
- **Render**: Free tier available, $7/month for hobby tier (recommended)
- **Supabase**: Free up to 500MB database, 1GB storage
- **Auth0**: Free up to 7,000 active users
- **Domain**: $10-15/year (one-time annual cost)

**Total**: $0-7/month for development, ~$7-15/month for production with hobby tier

## Scaling Considerations

As your app grows:

1. **Database**: Upgrade Supabase to Pro ($25/month) for 8GB + daily backups
2. **Backend**: Scale to Render Standard ($25/month) for 2GB RAM + always-on
3. **CDN**: Vercel Pro ($20/month) for improved edge caching
4. **XRPL**: Move to mainnet with production credentials
5. **Storage**: Upgrade IPFS pinning service for faster retrieval

## Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **XRPL Docs**: https://xrpl.org/docs
- **Auth0 Docs**: https://auth0.com/docs

## Next Steps After Deployment

1. Set up analytics (PostHog, Plausible, or Google Analytics)
2. Configure error monitoring (Sentry)
3. Add status page (status.xrpotato.com)
4. Set up automated backups for database
5. Create documentation site for API endpoints
6. Add uptime monitoring (UptimeRobot, Pingdom)
7. Plan XRPL mainnet migration strategy
