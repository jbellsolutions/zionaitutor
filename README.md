# 🚀 Zion's Growth Home Base

An AI-powered daily learning assistant with voice interaction for young learners.

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
- Node.js
- Express
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
│   └── styles/                 # CSS files
├── server/
│   ├── index.js                # Express server
│   └── routes/
│       ├── tasks.js            # Task management endpoints
│       └── tools.js            # Vapi function tools
├── .env.example                # Environment variables template
├── AIRTABLE_SCHEMA.md          # Database setup guide
├── VAPI_SETUP.md               # Vapi configuration guide
└── README.md                   # This file
```

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd zionaitutor
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```bash
# Vapi Configuration
VAPI_API_KEY=your_vapi_api_key_here
VAPI_ASSISTANT_ID=your_vapi_assistant_id_here
VAPI_PUBLIC_KEY=your_vapi_public_key_here

# AirTable Configuration
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_airtable_base_id_here
AIRTABLE_TABLE_NAME=DailyTasks

# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 3. Set Up AirTable

Follow the detailed instructions in `AIRTABLE_SCHEMA.md` to:
1. Create your AirTable base
2. Add required tables (DailyTasks, MathProgress)
3. Get your API credentials

### 4. Set Up Vapi Assistant

Follow the detailed instructions in `VAPI_SETUP.md` to:
1. Create your Vapi account
2. Configure the assistant with the tutor system prompt
3. Add function tools (mental math, search, task updates)
4. Configure voice and transcription settings

### 5. Run the Application

**Development mode (runs both frontend and backend):**
```bash
npm run dev
```

**Or run separately:**

Terminal 1 - Backend:
```bash
npm run server
```

Terminal 2 - Frontend:
```bash
npm run client
```

Visit `http://localhost:3000` in your browser.

### 6. Production Build

```bash
npm run build
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

## Deployment

### Backend (Server)

Deploy to:
- **Heroku** - Easy Node.js hosting
- **Railway** - Modern platform
- **DigitalOcean** - More control
- **AWS/GCP** - Enterprise

Remember to:
1. Set environment variables
2. Use production AirTable base
3. Update CORS settings
4. Update Vapi tool URLs

### Frontend

Deploy to:
- **Vercel** - Recommended for React
- **Netlify** - Great for static sites
- **GitHub Pages** - Free option

Build first:
```bash
npm run build
```

Update `.env` with production backend URL.

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
