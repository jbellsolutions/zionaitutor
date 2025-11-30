# 🚀 Easy Deployment Guide for Vercel

This guide shows you how to deploy Zion's Growth Home Base to Vercel in minutes. No complex setup required!

---

## Why Vercel?

✅ **One-Click Deploy** - Deploy with a single click
✅ **Auto SSL/HTTPS** - Secure by default
✅ **Global CDN** - Fast loading worldwide
✅ **Automatic Deployments** - Push to git = auto deploy
✅ **Free Tier** - Perfect for personal projects
✅ **Easy Updates** - Just push code changes
✅ **No Server Management** - Serverless functions

---

## Quick Deploy (3 Steps)

### Step 1: Push Your Code to GitHub

If you haven't already:

```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for Vercel deployment"
git push
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** (or Log In)
3. Choose **"Continue with GitHub"**
4. Click **"Import Project"**
5. Select your **zionaitutor** repository
6. Click **"Import"**
7. Vercel will auto-detect it's a React app
8. Click **"Deploy"**

That's it! Your app is live! 🎉

### Step 3: Add Environment Variables

After deployment:

1. Go to your project dashboard on Vercel
2. Click **"Settings"** tab
3. Click **"Environment Variables"** in sidebar
4. Add these variables:

#### Frontend Variables (Required for Voice Chat):

```
Name: REACT_APP_VAPI_PUBLIC_KEY
Value: pk_your_actual_public_key_here
```

```
Name: REACT_APP_VAPI_ASSISTANT_ID
Value: asst_your_actual_assistant_id_here
```

#### Backend Variables (Required for AirTable):

```
Name: AIRTABLE_API_KEY
Value: key_your_actual_airtable_key_here
```

```
Name: AIRTABLE_BASE_ID
Value: app_your_actual_base_id_here
```

```
Name: AIRTABLE_TABLE_NAME
Value: DailyTasks
```

After adding variables, click **"Redeploy"** at the top.

---

## Getting Your Credentials

### Vapi Credentials

1. Go to [dashboard.vapi.ai](https://dashboard.vapi.ai)
2. Navigate to **Settings → API Keys**
3. Copy your **Public Key** (starts with `pk_`)
4. Copy your **Assistant ID** from the Assistants page (starts with `asst_`)

### AirTable Credentials

1. Go to [airtable.com/account](https://airtable.com/account)
2. Scroll to API section
3. Generate API key (starts with `key_`)
4. Go to [airtable.com/api](https://airtable.com/api)
5. Select your base
6. Copy the Base ID from the URL (starts with `app_`)

---

## Your Deployment URL

After deployment, you'll get a URL like:

```
https://zionaitutor.vercel.app
```

Or use a custom domain (instructions below).

---

## 📝 Making Updates (Super Easy!)

### Method 1: Edit in GitHub (Easiest!)

1. Go to your repository on GitHub
2. Navigate to the file you want to edit
3. Click the pencil icon (Edit)
4. Make your changes
5. Click **"Commit changes"**
6. Vercel automatically redeploys! ⚡

**Wait 1-2 minutes** and your changes are live!

### Method 2: Edit Locally

```bash
# Make your changes locally
# Then commit and push

git add .
git commit -m "Updated tutor personality"
git push
```

Vercel auto-deploys on every push!

---

## 🎨 Easy Customizations

### Change Daily Tasks

**File:** `api/tasks/today.js`
**Line:** Find the `getDefaultTasks()` function

```javascript
{
  id: 'task-7',
  name: 'Jiu-Jitsu Practice', // ← Change this
  duration: '30 minutes',      // ← Change this
  emoji: '🥋',                 // ← Change this
  category: 'sports',          // ← Change this
  completed: false
}
```

Commit and push → Auto deploys!

### Adjust Math Difficulty

**File:** `api/tools/mental-math.js`
**Line:** Find `generateSingleQuestion()` function

```javascript
case 'easy':
  num1 = Math.floor(Math.random() * 20) + 10; // ← Adjust range
  num2 = Math.floor(Math.random() * 20) + 10; // ← Adjust range
  break;
```

### Change Colors/Styling

**File:** `src/index.css`
**Line 11:** Background gradient

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
/* Change to any colors you like! */
```

**File:** `src/components/VoiceWidget.css`
**Line 29:** Orb colors

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Update Tutor Personality

**Option 1:** In Vapi Dashboard (Recommended)
- Go to [dashboard.vapi.ai](https://dashboard.vapi.ai)
- Edit your assistant
- Update the System Prompt
- Changes are instant!

**Option 2:** In Code (for reference)
- See `VAPI_SETUP.md` for the full prompt
- Copy it to Vapi dashboard

---

## 🔧 Updating Vapi Tool URLs

After deployment, update your Vapi function tools:

1. Go to [dashboard.vapi.ai](https://dashboard.vapi.ai)
2. Click on your assistant
3. Edit each tool
4. Update the **Server URL** to:

```
https://your-app.vercel.app/api/tools/mental-math
https://your-app.vercel.app/api/tools/search
https://your-app.vercel.app/api/tools/update-task
```

Replace `your-app` with your actual Vercel domain.

---

## 🌐 Using a Custom Domain

Want `zion.yourdomain.com` instead of `.vercel.app`?

1. In Vercel dashboard, go to **Settings → Domains**
2. Click **"Add"**
3. Enter your domain (e.g., `zion.yourdomain.com`)
4. Follow DNS instructions
5. Wait 5-10 minutes for DNS propagation
6. Done! Your custom domain works!

---

## 📊 Monitoring & Logs

### View Logs

1. Go to Vercel dashboard
2. Click your project
3. Click **"Functions"** tab
4. Click on any function to see logs
5. See real-time logs of API calls

### View Analytics

1. Go to **"Analytics"** tab
2. See page views, performance, etc.

---

## 🎯 Local Development

To test before deploying:

```bash
# Install dependencies
npm install

# Run locally
npm start

# Backend (for testing serverless functions locally)
npm run server
```

Visit `http://localhost:3000`

---

## 🔄 Common Update Scenarios

### Scenario 1: "I want to add a new learning topic"

**Edit:** `api/tools/search.js`

Add to the `knowledgeBase` object:

```javascript
science: {
  'tornado': 'A tornado is...',
  'volcano': 'A volcano is...',
  'photosynthesis': 'Photosynthesis is how plants make food using sunlight!' // ← New topic
}
```

Commit → Push → Auto deploys!

### Scenario 2: "I want to change the 8 AM reset time"

**Edit:** `src/App.js`

Currently checks every minute. The actual reset logic is in the backend/AirTable.

For Vercel, this is handled client-side by checking the date on load.

### Scenario 3: "I want different math problem types"

**Edit:** `api/tools/mental-math.js`

In `generateSingleQuestion()`:

```javascript
const types = ['addition', 'subtraction', 'multiplication', 'division']; // ← Add division
```

Then add the case:

```javascript
case 'division':
  num1 = num2 * Math.floor(Math.random() * 10 + 2); // Ensure whole number
  answer = num1 / num2;
  question = `${num1} ÷ ${num2}`;
  break;
```

### Scenario 4: "I want to change the voice"

1. Go to Vapi dashboard
2. Edit assistant
3. Change voice settings
4. Try different voices instantly!
5. No code changes needed!

---

## 🐛 Troubleshooting

### Issue: Voice widget shows "Failed to connect"

**Solution:**
1. Check Environment Variables in Vercel
2. Make sure `REACT_APP_VAPI_PUBLIC_KEY` is set
3. Redeploy after adding variables

### Issue: Tasks not loading

**Solution:**
1. Check AirTable credentials in Vercel
2. Verify table name matches exactly
3. App works without AirTable (uses defaults)

### Issue: Tools not working

**Solution:**
1. Update tool URLs in Vapi dashboard
2. Use: `https://your-app.vercel.app/api/tools/...`
3. Check function logs in Vercel dashboard

### Issue: Changes not showing up

**Solution:**
1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Wait 2-3 minutes after deployment
3. Check Vercel dashboard for deployment status

---

## 💾 Backup & Version Control

### Automatic Backups

Every git commit is a backup! To rollback:

1. In Vercel dashboard, go to **"Deployments"**
2. Find the version you want
3. Click **"..."** → **"Promote to Production"**

### Creating a Backup Branch

```bash
git checkout -b backup-2025-11-30
git push origin backup-2025-11-30
```

Now you can always return to this version!

---

## 📱 Mobile Optimization

The app is already mobile-responsive! Test on:
- iPhone/iPad
- Android phones/tablets
- Different screen sizes

The voice orb scales automatically.

---

## 🔒 Security Best Practices

✅ **Never commit `.env` file** - Already in `.gitignore`
✅ **Use environment variables** - Already set up
✅ **HTTPS by default** - Vercel provides this
✅ **API keys in Vercel only** - Keep them secret

---

## 📈 Scaling

Vercel automatically scales! No configuration needed.

- Handles traffic spikes
- Global CDN
- Serverless functions scale automatically

---

## 💰 Costs

**Vercel Free Tier includes:**
- Unlimited deployments
- 100 GB bandwidth/month
- Serverless function executions
- SSL certificates
- Custom domains

**Paid if you exceed:**
- This app should stay free for personal use!
- Monitor usage in Vercel dashboard

**Other Services:**
- **Vapi**: Check [vapi.ai/pricing](https://vapi.ai/pricing)
- **AirTable**: Free tier is usually sufficient

---

## 🎓 Learning Resources

- [Vercel Docs](https://vercel.com/docs)
- [React Docs](https://react.dev)
- [Vapi Docs](https://docs.vapi.ai)
- [AirTable API Docs](https://airtable.com/developers/web/api/introduction)

---

## ✨ Quick Reference

### Deploy
```bash
git push
# That's it! Auto-deploys to Vercel
```

### View Live Site
```
https://your-app.vercel.app
```

### Edit Files
- **GitHub Web UI** (easiest for non-coders)
- **Local editor** + git push (for developers)

### View Logs
- Vercel Dashboard → Functions → Click function

### Rollback
- Vercel Dashboard → Deployments → Select previous → Promote

---

## 🎉 You're All Set!

Your app is now:
- ✅ Deployed globally
- ✅ Auto-updating on git push
- ✅ Secure with HTTPS
- ✅ Fast with CDN
- ✅ Easy to edit
- ✅ Free to run

Just push code and it deploys automatically! 🚀

Need help? Check the logs in Vercel dashboard or review this guide.

---

**Last Updated:** 2025-11-30
**Vercel Version:** 2
**React Version:** 18.2.0
