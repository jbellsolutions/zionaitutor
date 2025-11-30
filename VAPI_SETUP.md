# Vapi Assistant Setup Guide

This guide will help you set up the Vapi voice assistant for Zion's tutor.

## Prerequisites

1. A Vapi account - Sign up at [vapi.ai](https://vapi.ai)
2. Your backend server running (for tool webhooks)
3. A public URL for your backend (use ngrok for local development)

---

## Step 1: Get Your Vapi Credentials

1. Log in to [dashboard.vapi.ai](https://dashboard.vapi.ai)
2. Go to "Settings" → "API Keys"
3. Copy your:
   - **Public Key** (starts with `pk_...`) - for frontend
   - **Private Key** (starts with `sk_...`) - for backend/server

---

## Step 2: Create the Assistant

1. Go to "Assistants" in the Vapi dashboard
2. Click "Create Assistant"
3. Fill in the details:

### Basic Settings:

**Name:** Zion's Tutor

**First Message:**
```
Hey Zion! I'm your tutor. Ready to learn something awesome today? What would you like to work on?
```

**System Prompt:**
```
You are Zion's personal tutor. Zion is a 5-year-old working at a third-grade level. He is smart, capable, and ready for real challenges. Your job is to conduct structured daily lessons that push him to grow—not to ask what he wants to do, but to lead him through a lesson plan.

YOUR ROLE: TUTOR, NOT ASSISTANT
You are conducting a lesson, not offering help.

NEVER say:
❌ "What do you want to work on?"
❌ "Would you like to try another problem?"
❌ "Can I help you with something?"

INSTEAD say:
✅ "Alright Zion, let's start today's lesson."
✅ "Great job. Here's your next one."
✅ "We've got 5 more to go. Ready? Here it is..."
✅ "Okay, we're done with math. Now let's do some reading."

You set the pace. You lead. You encourage. You challenge.

PATIENCE AND LISTENING:
- Give Zion time to think out loud (up to 10 seconds)
- Listen carefully as he works through problems verbally
- Don't interrupt when he's thinking through steps
- Document his thought process
- After 10 seconds of silence, gently check in: "Take your time. Do you need help?"

DAILY LESSON STRUCTURE:
1. MENTAL MATH (20 Questions) - Use the mental_math_tool
2. READING & COMPREHENSION (10 Questions)
3. SCIENCE & CURIOSITY (10 Facts/Questions)

Always:
- One question at a time
- Wait for full response before moving on
- Be encouraging and positive
- Challenge him appropriately
- Document progress

You have access to tools:
- mental_math_tool: Generate and track math problems
- update_task_status: Mark tasks as complete on the page
- search_tool: Answer questions and find information
```

### Voice Settings:

**Voice Provider:** PlayHT (or ElevenLabs)

**Voice:** Choose a warm, encouraging female voice
- PlayHT: "jennifer" or "sara"
- ElevenLabs: "Rachel" or "Bella"

**Voice Speed:** 0.9-0.95 (slightly slower for clarity)

**Voice Stability:** 0.8

**Voice Similarity:** 0.8

### Model Settings:

**Model Provider:** OpenAI

**Model:** gpt-4 (for best performance)

**Temperature:** 0.7

**Max Tokens:** 500

### Transcriber Settings:

**Provider:** Deepgram

**Model:** nova-2

**Language:** en-US

**Smart Format:** ON

**Endpointing:** 300ms (wait time before considering speech ended)

**Keywords:** Add these for better recognition:
- Zion
- mental math
- piano
- reading
- science
- multiplication
- addition
- subtraction

### Advanced Settings:

**Silence Timeout:** 10000ms (10 seconds)
- This gives Zion time to think out loud without interruption

**Background Denoising:** ON

**Interruption Sensitivity:** LOW
- Prevents accidental interruptions while Zion is working through problems

**Max Call Duration:** 1800 seconds (30 minutes)

**Server Messages:** ON
- Enables real-time updates to the frontend

---

## Step 3: Configure Function Tools

Add these three function tools to your assistant:

### Tool 1: Mental Math Tool

**Name:** `mental_math_tool`

**Description:**
```
Generates mental math questions for Zion, checks answers, and tracks progress. Use this when conducting math lessons.
```

**Server URL:**
```
https://your-domain.com/api/tools/mental-math
```
(Replace with your actual backend URL)

**Method:** POST

**Parameters:**
```json
{
  "type": "object",
  "properties": {
    "action": {
      "type": "string",
      "enum": ["generate", "check-answer", "get-progress"],
      "description": "Action to perform: generate new questions, check an answer, or get current progress"
    },
    "sessionId": {
      "type": "string",
      "description": "Unique session ID for this practice session"
    },
    "difficulty": {
      "type": "string",
      "enum": ["easy", "medium", "hard"],
      "description": "Difficulty level for generated questions"
    },
    "count": {
      "type": "number",
      "description": "Number of questions to generate (typically 5 per batch)"
    },
    "questionId": {
      "type": "string",
      "description": "ID of the question being answered (for check-answer action)"
    },
    "answer": {
      "type": "number",
      "description": "Zion's answer to check (for check-answer action)"
    }
  },
  "required": ["action", "sessionId"]
}
```

**Usage Example:**
```javascript
// Generate 5 medium difficulty questions
{
  "action": "generate",
  "sessionId": "session-2025-11-30",
  "difficulty": "medium",
  "count": 5
}

// Check an answer
{
  "action": "check-answer",
  "sessionId": "session-2025-11-30",
  "questionId": "q-1701342000000-0",
  "answer": 83
}
```

### Tool 2: Search Tool

**Name:** `search_tool`

**Description:**
```
Search for educational information about science, space, and other topics. Use this when Zion asks questions about the world.
```

**Server URL:**
```
https://your-domain.com/api/tools/search
```

**Method:** POST

**Parameters:**
```json
{
  "type": "object",
  "properties": {
    "query": {
      "type": "string",
      "description": "The search query or question"
    },
    "category": {
      "type": "string",
      "enum": ["space", "science", "math", "general"],
      "description": "Category to search in (optional)"
    }
  },
  "required": ["query"]
}
```

**Usage Example:**
```javascript
{
  "query": "black holes",
  "category": "space"
}
```

### Tool 3: Update Task Status

**Name:** `update_task_status`

**Description:**
```
Mark a task as complete on Zion's checklist. Use this when Zion finishes an activity.
```

**Server URL:**
```
https://your-domain.com/api/tools/update-task
```

**Method:** POST

**Parameters:**
```json
{
  "type": "object",
  "properties": {
    "taskName": {
      "type": "string",
      "description": "Name of the task to update"
    },
    "completed": {
      "type": "boolean",
      "description": "Whether the task is completed (true) or not (false)"
    }
  },
  "required": ["taskName", "completed"]
}
```

**Usage Example:**
```javascript
{
  "taskName": "Mental Math Practice",
  "completed": true
}
```

---

## Step 4: Save and Get Assistant ID

1. Click "Save" to create the assistant
2. Copy the **Assistant ID** (starts with `asst_...`)
3. Add it to your `.env` file:

```bash
VAPI_PUBLIC_KEY=pk_XXXXXXXXXX
VAPI_ASSISTANT_ID=asst_XXXXXXXXXX
```

---

## Step 5: Test the Assistant

### Test in Vapi Dashboard:

1. Go to your assistant
2. Click "Test" button
3. Try these interactions:
   - "Let's do mental math"
   - "What's 47 plus 36?"
   - "Tell me about black holes"

### Test in Your App:

1. Make sure your `.env` is configured
2. Start the app: `npm run dev`
3. Click the voice widget orb
4. Have a conversation!

---

## Advanced Configuration

### Persistent Connection & Auto-Reconnect

The widget automatically:
- Reconnects if disconnected unexpectedly
- Maintains session state across reconnects
- Shows connection time and status

### Turn-Taking & Endpointing

To handle Zion's thinking-out-loud process:

**Endpointing:** 300ms
- Waits 300ms of silence before considering speech ended

**Interruption Sensitivity:** LOW
- Won't interrupt while Zion is working through a problem

**Silence Timeout:** 10000ms (10 seconds)
- After 10 seconds of silence, gently checks in

You can adjust these in the Vapi dashboard under "Advanced Settings".

### Conversation Flow Example

```
Assistant: "Alright Zion, let's do some mental math. Here's your first question: What's 47 plus 36?"

Zion: "Hmm... 47 plus 36... that's the same as 47 plus 30 plus 6...
       47 plus 30 is 77... 77 plus 6 is... 83!"

[300ms pause - assistant waits]
[No interruption - listens to full thought process]
