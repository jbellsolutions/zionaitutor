# 🚀 Zion's Growth Home Base

An AI-powered daily learning assistant with voice interaction for young learners.

## ⚡ Quick Start

**Want to deploy now?** See **[QUICK_START.md](QUICK_START.md)** for 5-minute setup!

**Deploy to Vercel in 1 click:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

📖 **Detailed Guides:**
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete Vercel deployment guide
- **[VAPI_SETUP.md](VAPI_SETUP.md)** - Voice assistant configuration
- **[AIRTABLE_SCHEMA.md](AIRTABLE_SCHEMA.md)** - Database setup (optional)

---

## Features

- ✅ **Voice Chat Widget** - Talk to an AI tutor powered by Vapi
- 📋 **Daily Checklist** - Track learning tasks that reset every morning at 8 AM
- 🧮 **Mental Math Practice** - Interactive math problems with progress tracking
- 📚 **Reading & Comprehension** - Structured lessons
- 🔬 **Science Exploration** - Learn about space, weather, and more
- 🎹 **Piano Practice** - Track music practice with app integration
- 💾 **AirTable Integration** - Persistent storage of progress and tasks
- 🔄 **Auto-Reconnect** - Stable voice connection with automatic reconnection
- ⏱️ **Patient Listening** - AI waits while student thinks through problems

## Tech Stack

**Frontend:**
- React 18
- Vapi Web SDK
- CSS3 with modern gradients and animations

**Backend:**
- Vercel Serverless Functions
- Node.js
- AirTable API

**AI/Voice:**
- Vapi (Voice AI)
- OpenAI GPT-4
- Deepgram (Speech-to-Text)
- PlayHT or ElevenLabs (Text-to-Speech)

## Project Structure

```
zionaitutor/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── VoiceWidget.js      # Voice chat interface
│   │   ├── DailyChecklist.js   # Task list display
│   │   └── TaskItem.js         # Individual task component
│   ├── services/
│   │   └── airtable.js         # AirTable API calls
│   ├── App.js                  # Main application
│   ├── index.js                # Entry point
│   └── *.css                   # Styling files
├── api/                        # Vercel Serverless Functions
│   ├── health.js               # Health check endpoint
│   ├── tasks/
│   │   ├── today.js            # Get today's tasks
│   │   ├── [id].js             # Update task by ID
│   │   └── check-reset.js      # Check daily reset
│   └── tools/
│       ├── mental-math.js      # Mental math generator
│       ├── search.js           # Educational search
│       └── update-task.js      # Update task via voice
├── server/                     # Express server (for local dev)
│   ├── index.js
│   └── routes/
├── vercel.json                 # Vercel configuration
├── .env.example                # Environment variables template
├── QUICK_START.md              # 5-minute setup guide
├── DEPLOYMENT.md               # Detailed deployment guide
├── AIRTABLE_SCHEMA.md          # Database setup guide
├── VAPI_SETUP.md               # Vapi configuration guide
└── README.md                   # This file
```

## Deployment

### 🌐 Recommended: Vercel (Easiest!)

**Deploy in 3 steps:**

1. **Push to GitHub**
   ```bash
   git push
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Click Deploy

3. **Add Environment Variables**
   - In Vercel dashboard → Settings → Environment Variables
   - Add: `REACT_APP_VAPI_PUBLIC_KEY`, `REACT_APP_VAPI_ASSISTANT_ID`
   - Optional: Add AirTable credentials

**Full guide:** See [DEPLOYMENT.md](DEPLOYMENT.md)

### 💻 Local Development

```bash
# 1. Install
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Edit .env with your keys

# 4. Run locally
npm start
```

For backend testing:
```bash
npm run server  # Run Express server for local API testing
```

## Usage

### For Zion (The Student)

1. **Open the app** - See your daily checklist
2. **Click the big orb** - Start talking to your tutor
3. **Say "Let's do mental math"** - Begin math practice
4. **Work through problems** - Think out loud, take your time
5. **Ask questions** - "Tell me about black holes"
6. **Complete tasks** - Check them off or ask the tutor to do it

### For Parents/Teachers

1. **View Progress** - Check AirTable for detailed progress reports
2. **Adjust Tasks** - Modify the default tasks in `server/routes/tasks.js`
3. **Review Sessions** - See math scores, engagement levels in AirTable
4. **Customize Lessons** - Update the tutor prompt in Vapi dashboard

## Key Features Explained

### Voice Widget

The voice widget provides:
- **Large, clickable orb** - Easy for young children to use
- **Visual feedback** - Changes color when connected/speaking
- **Auto-reconnect** - Reconnects automatically if disconnected
- **Connection timer** - Shows how long you've been connected
- **Patient listening** - Waits up to 10 seconds before checking in

### Daily Reset

Every day at 8:00 AM:
- Tasks reset to uncompleted
- New mental math session begins
- Fresh start for the day

### Mental Math Tool

Features:
- Generates appropriate difficulty problems
- Tracks correct/incorrect answers
- Provides encouraging feedback
- Saves progress to AirTable
- Batches problems in sets of 5

Difficulty levels:
- **Easy**: 10-29 range addition/subtraction
- **Medium**: 20-69 range (default)
- **Hard**: 50-149 range

### Conversation Flow

The AI tutor:
1. **Leads** - Doesn't ask what Zion wants, leads the lesson
2. **Waits** - Gives time to think (up to 10 seconds)
3. **Listens** - Hears the full thought process
4. **Encourages** - Positive reinforcement always
5. **Teaches** - Explains step-by-step when needed

## Customization

### Change Daily Tasks

Edit `server/routes/tasks.js`, function `getDefaultTasks()`:

```javascript
{
  name: 'New Task Name',
  duration: '15 minutes',
  emoji: '🎯',
  link: 'https://optional-link.com',
  category: 'custom',
  completed: false
}
```

### Adjust Math Difficulty

Edit `server/routes/tools.js`, function `generateSingleQuestion()`:

```javascript
case 'easy':
  num1 = Math.floor(Math.random() * 20) + 10; // Adjust range
  num2 = Math.floor(Math.random() * 20) + 10;
  break;
```

### Change Voice Settings

In Vapi dashboard:
- Try different voices (PlayHT, ElevenLabs)
- Adjust speed (0.8 - 1.2)
- Modify stability/similarity

### Update Tutor Personality

Edit the system prompt in `VAPI_SETUP.md` or directly in Vapi dashboard.

## Troubleshooting

### Voice Widget Not Connecting

1. Check Vapi credentials in `.env`
2. Ensure backend is running on port 3001
3. Check browser console for errors
4. Verify Vapi assistant ID is correct

### Tasks Not Loading

1. Verify AirTable credentials
2. Check table names match exactly
3. Look at server logs: `npm run server`
4. Try without AirTable first (uses default tasks)

### Tools Not Working

1. Ensure backend URL is accessible to Vapi
2. For local dev, use ngrok: `ngrok http 3001`
3. Update tool URLs in Vapi dashboard
4. Check server logs for webhook calls

### Auto-Reconnect Not Working

1. Check browser console for errors
2. Ensure Vapi public key is correct
3. Check internet connection
4. Try manual reconnect first

## Development

### Adding a New Tool

1. Create route in `server/routes/tools.js`:
```javascript
router.post('/my-tool', async (req, res) => {
  // Tool logic
});
```

2. Add to Vapi assistant in dashboard
3. Update system prompt to explain tool usage

### Adding a New Task Category

1. Update AirTable field "Category" options
2. Add to `getDefaultTasks()` in `server/routes/tasks.js`
3. Optional: Add category-specific styling

### Testing

```bash
# Test backend endpoints
curl http://localhost:3001/health
curl http://localhost:3001/api/tasks/today

# Test tool endpoints
curl -X POST http://localhost:3001/api/tools/mental-math \
  -H "Content-Type: application/json" \
  -d '{"action":"generate","sessionId":"test","difficulty":"medium","count":5}'
```

## Making Changes

### ✏️ Super Easy: Edit on GitHub

1. Navigate to file on GitHub
2. Click pencil icon (Edit)
3. Make changes
4. Commit
5. **Auto-deploys to Vercel!** ⚡

### 🛠️ Developer Way

```bash
# Edit files locally
git add .
git commit -m "Your changes"
git push
# Auto-deploys!
```

### Common Edits

**Change Daily Tasks:** `api/tasks/today.js` → `getDefaultTasks()`
**Adjust Math Difficulty:** `api/tools/mental-math.js`
**Change Colors:** `src/index.css`, `src/components/*.css`
**Update Tutor Voice:** Vapi dashboard (no code needed!)

## Security Notes

- Never commit `.env` file
- Use environment variables for all secrets
- Enable CORS only for your domain in production
- Use HTTPS for all endpoints
- Consider OAuth for AirTable in production

## Future Enhancements

- [ ] Video chat option
- [ ] Streak tracking and rewards
- [ ] Parent dashboard
- [ ] Weekly progress reports via email
- [ ] More learning games
- [ ] Multiplayer sessions
- [ ] Voice authentication
- [ ] Offline mode
- [ ] Mobile app version

## Support

For issues, questions, or suggestions:
1. Check `AIRTABLE_SCHEMA.md` for database questions
2. Check `VAPI_SETUP.md` for voice assistant questions
3. Review server logs for backend issues
4. Check browser console for frontend issues

## License

MIT License - Feel free to use and modify for your own tutoring needs!

## Acknowledgments

- Built with [Vapi](https://vapi.ai) for voice AI
- Uses [AirTable](https://airtable.com) for data storage
- Powered by [OpenAI](https://openai.com) GPT-4
- Speech recognition by [Deepgram](https://deepgram.com)
- Voice synthesis by [PlayHT](https://play.ht) or [ElevenLabs](https://elevenlabs.io)

---

Made with ❤️ for Zion's learning journey
