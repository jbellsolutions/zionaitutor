# ⚡ Quick Start Guide

Get Zion's Growth Home Base running in 5 minutes!

---

## 🎯 Super Quick Deploy (Vercel)

### 1. Deploy to Vercel (1 minute)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/zionaitutor)

Or manually:
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Click Deploy
4. Done! 🎉

### 2. Add Environment Variables (2 minutes)

In Vercel dashboard → Settings → Environment Variables:

**Must Have (For Voice Chat):**
```
REACT_APP_VAPI_PUBLIC_KEY = pk_your_key_here
REACT_APP_VAPI_ASSISTANT_ID = asst_your_id_here
```

**Optional (For Data Persistence):**
```
AIRTABLE_API_KEY = key_your_key_here
AIRTABLE_BASE_ID = app_your_id_here
AIRTABLE_TABLE_NAME = DailyTasks
```

### 3. Configure Vapi (2 minutes)

1. Go to [vapi.ai](https://vapi.ai) and create assistant
2. Copy the system prompt from `VAPI_SETUP.md`
3. Add three tools pointing to:
   - `https://your-app.vercel.app/api/tools/mental-math`
   - `https://your-app.vercel.app/api/tools/search`
   - `https://your-app.vercel.app/api/tools/update-task`

**Done! Your app is live!** 🚀

---

## 🏠 Local Development (Optional)

### If you want to run locally:

```bash
# 1. Install
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Edit .env with your keys
# Add: REACT_APP_API_URL=http://localhost:3001

# 4. Run dev mode (frontend + backend)
npm run dev
```

Visit `http://localhost:3000`

---

## 📝 Making Changes

### Easy Way (GitHub Web)
1. Go to GitHub repository
2. Click file → Edit (pencil icon)
3. Make changes
4. Commit
5. **Auto-deploys to Vercel!** ⚡

### Developer Way
```bash
# Edit files locally
# Then:
git add .
git commit -m "My changes"
git push
# Auto-deploys!
```

---

## 🎨 Common Edits

### Change Tasks
**File:** `api/tasks/today.js`
**Function:** `getDefaultTasks()`

### Change Math Difficulty
**File:** `api/tools/mental-math.js`
**Function:** `generateSingleQuestion()`

### Change Colors
**File:** `src/index.css` (line 11)

### Change Tutor Voice
**Location:** Vapi dashboard (no code needed!)

---

## 📚 Full Docs

- **README.md** - Complete project overview
- **DEPLOYMENT.md** - Detailed deployment guide
- **VAPI_SETUP.md** - Voice assistant setup
- **AIRTABLE_SCHEMA.md** - Database setup

---

## 🆘 Need Help?

### Voice not working?
- Check `REACT_APP_VAPI_PUBLIC_KEY` in Vercel
- Verify Vapi assistant ID is correct

### Tasks not loading?
- App works without AirTable (uses defaults)
- Check AirTable credentials if you set it up

### Changes not showing?
- Wait 2 minutes after deployment
- Hard refresh browser (Ctrl+Shift+R)

---

## ✨ That's It!

Your AI tutor is ready for Zion! 🎓

**Live URL:** Check Vercel dashboard for your URL

**Next Steps:**
1. Test the voice chat
2. Try the mental math tool
3. Customize tasks for Zion's needs
4. Monitor progress in AirTable

Have fun learning! 🚀
