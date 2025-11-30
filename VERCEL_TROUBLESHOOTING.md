# 🔧 Vercel Deployment Troubleshooting

Common issues and fixes for Vercel deployment.

---

## ✅ Quick Fixes Applied

### Issue 1: Deprecated `vercel.json` Configuration
**Problem:** Using old `builds` and `routes` syntax
**Fix:** Simplified to modern `rewrites` syntax

### Issue 2: API URL Configuration
**Problem:** Frontend trying to call `localhost:3001` in production
**Fix:** Uses relative URLs (empty string) for production, absolute URL for local dev

---

## 🚀 How It Should Work

### Production (Vercel):
- Frontend: `https://your-app.vercel.app`
- API: `https://your-app.vercel.app/api/*`
- Frontend calls `/api/*` (same domain, no CORS)

### Local Development:
- Frontend: `http://localhost:3000`
- API: `http://localhost:3001`
- Use `.env.local` with `REACT_APP_API_URL=http://localhost:3001`

---

## 🐛 Common Deployment Errors

### Error: "Build Failed"

**Possible Causes:**
1. Missing dependencies
2. Build script error
3. Environment variables not set

**Solutions:**

**Check 1: Install Dependencies**
```bash
npm install
```

**Check 2: Test Build Locally**
```bash
npm run build
```
If this fails locally, fix the error before deploying.

**Check 3: Environment Variables**
Make sure these are set in Vercel:
- `REACT_APP_VAPI_PUBLIC_KEY`
- `REACT_APP_VAPI_ASSISTANT_ID`

---

### Error: "API Routes Not Working"

**Symptoms:**
- Frontend loads but tasks don't appear
- Console shows 404 errors for `/api/*`

**Solutions:**

**Check 1: Verify Serverless Functions**
In Vercel dashboard → Functions tab:
- Should see: `api/health.js`, `api/tasks/today.js`, etc.
- If not listed, check file structure

**Check 2: Test API Endpoint**
Visit: `https://your-app.vercel.app/api/health`
- Should return: `{"status":"ok",...}`

**Check 3: Check Function Logs**
Vercel dashboard → Functions → Click function → View logs

---

### Error: "Voice Widget Not Connecting"

**Symptoms:**
- Orb shows "Failed to connect"
- No voice interaction

**Solutions:**

**Check 1: Environment Variables**
In Vercel → Settings → Environment Variables:
- `REACT_APP_VAPI_PUBLIC_KEY` must start with `pk_`
- `REACT_APP_VAPI_ASSISTANT_ID` must start with `asst_`

**Check 2: Redeploy After Adding Env Vars**
Environment variables only apply after redeployment:
1. Add/update variables
2. Deployments tab → Click "..." → Redeploy

**Check 3: Check Browser Console**
Press F12 → Console tab → Look for Vapi errors

---

### Error: "Tasks Not Saving"

**Symptoms:**
- Can check tasks but they don't persist
- Page refresh loses progress

**Solutions:**

**Check 1: AirTable Not Required**
App works without AirTable (uses default tasks)

**Check 2: If Using AirTable**
Set these in Vercel:
- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID`
- `AIRTABLE_TABLE_NAME`

**Check 3: Check Function Logs**
Look for AirTable errors in Vercel function logs

---

### Error: "Changes Not Showing Up"

**Symptoms:**
- Pushed code but site unchanged
- Old version still showing

**Solutions:**

**Solution 1: Wait for Deployment**
- Check Vercel dashboard → Deployments
- Wait for "Ready" status (usually 1-2 minutes)

**Solution 2: Hard Refresh Browser**
- Chrome/Edge: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Firefox: `Ctrl + F5` or `Cmd + Shift + R`

**Solution 3: Check Deployment Status**
- Vercel dashboard shows build logs
- Look for errors in build output

---

## 🔍 Debugging Steps

### Step 1: Check Build Logs

1. Go to Vercel dashboard
2. Click your project
3. Click latest deployment
4. Review "Building" section
5. Look for error messages

### Step 2: Check Function Logs

1. Vercel dashboard → Functions
2. Click on a function (e.g., `api/tasks/today`)
3. Click "View Logs"
4. Test the endpoint to see live logs

### Step 3: Test API Endpoints

**Test Health Check:**
```
https://your-app.vercel.app/api/health
```
Should return:
```json
{
  "status": "ok",
  "timestamp": "2025-11-30T...",
  "environment": "vercel"
}
```

**Test Tasks Endpoint:**
```
https://your-app.vercel.app/api/tasks/today
```
Should return:
```json
{
  "tasks": [...]
}
```

### Step 4: Check Browser Console

1. Open your app in browser
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Look for errors (red text)
5. Go to Network tab
6. Reload page
7. Check which requests fail

---

## 🛠️ Local Development Setup

To test locally before deploying:

**1. Create `.env.local` file:**
```bash
cp .env.local.example .env.local
```

**2. Edit `.env.local`:**
```
REACT_APP_API_URL=http://localhost:3001
REACT_APP_VAPI_PUBLIC_KEY=pk_your_key
REACT_APP_VAPI_ASSISTANT_ID=asst_your_id
```

**3. Create `.env` for backend:**
```
AIRTABLE_API_KEY=key_your_key
AIRTABLE_BASE_ID=app_your_id
AIRTABLE_TABLE_NAME=DailyTasks
```

**4. Run development servers:**
```bash
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend
npm start
```

**5. Test:**
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001/api/health`

---

## 📦 File Structure Check

Make sure your structure looks like this:

```
zionaitutor/
├── api/                    ✅ Serverless functions
│   ├── health.js
│   ├── tasks/
│   │   ├── today.js
│   │   ├── [id].js
│   │   └── check-reset.js
│   └── tools/
│       ├── mental-math.js
│       ├── search.js
│       └── update-task.js
├── src/                    ✅ React app
├── public/
├── vercel.json            ✅ Vercel config
└── package.json           ✅ Dependencies
```

---

## 🔐 Environment Variables Checklist

### Required for Voice Chat:
- [ ] `REACT_APP_VAPI_PUBLIC_KEY` (starts with `pk_`)
- [ ] `REACT_APP_VAPI_ASSISTANT_ID` (starts with `asst_`)

### Optional for Data Persistence:
- [ ] `AIRTABLE_API_KEY` (starts with `key_`)
- [ ] `AIRTABLE_BASE_ID` (starts with `app_`)
- [ ] `AIRTABLE_TABLE_NAME` (usually `DailyTasks`)

### Leave Empty in Vercel:
- [ ] `REACT_APP_API_URL` (should be empty or not set)

---

## ⚡ Quick Test After Deployment

**1. Visit your app:**
```
https://your-app.vercel.app
```

**2. Open browser console (F12)**

**3. Check for errors**

**4. Test health endpoint:**
```
https://your-app.vercel.app/api/health
```

**5. Test voice widget:**
- Click the orb
- Should connect within 2-3 seconds
- Check console for Vapi errors

**6. Test tasks:**
- Should see 6 default tasks
- Try checking one off
- Refresh page (should persist if AirTable configured)

---

## 🆘 Still Having Issues?

### Check These:

1. **Vercel Dashboard → Deployments**
   - Is latest deployment "Ready"?
   - Any errors in build logs?

2. **Vercel Dashboard → Functions**
   - Are functions listed?
   - Click one → Check logs

3. **Browser Developer Tools (F12)**
   - Console errors?
   - Network tab → Failed requests?

4. **Environment Variables**
   - All required variables set?
   - Redeployed after adding them?

5. **Git Status**
   - Latest code pushed to GitHub?
   - Correct branch deployed?

---

## 💡 Pro Tips

**Tip 1: Use Preview Deployments**
- Every git push creates a preview URL
- Test there before promoting to production

**Tip 2: Check Function Logs Regularly**
- Real-time debugging
- See exactly what's happening

**Tip 3: Test Locally First**
- Run `npm run build` before pushing
- Catches build errors early

**Tip 4: Use Vercel CLI for Advanced Debugging**
```bash
npm i -g vercel
vercel login
vercel logs
```

---

## 📞 Getting Help

If you're still stuck:

1. **Check build logs** in Vercel dashboard
2. **Copy the error message**
3. **Check which step failed** (Build, Deploy, Runtime)
4. **Look for specific error** in this guide

Most issues are:
- Missing environment variables (60%)
- Build errors from local code (30%)
- Configuration issues (10%)

---

**Last Updated:** 2025-11-30
**Vercel Version:** Latest
**Framework:** React 18 + Serverless Functions
