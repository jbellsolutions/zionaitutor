# AirTable Database Schema

This document describes the required AirTable base structure for Zion's Growth Home Base.

## Base Setup

1. Create a new AirTable base called "ZionTutor" (or any name you prefer)
2. Create the following tables:

---

## Table 1: DailyTasks

This table stores the daily learning tasks for Zion.

### Fields:

| Field Name | Field Type | Description | Options |
|------------|-----------|-------------|---------|
| Date | Date | The date for these tasks | Format: Local date |
| Name | Single line text | Name of the task | Required |
| Duration | Single line text | How long the task should take | e.g., "20 minutes", "20-30 questions" |
| Emoji | Single line text | Emoji icon for the task | e.g., "🧮", "📚" |
| Link | URL | Optional link to external app/resource | |
| Category | Single select | Category of the task | Options: math, reading, science, music, other |
| Order | Number | Display order (1, 2, 3...) | Integer |
| Completed | Checkbox | Whether the task is completed | |
| CompletedAt | Date | When the task was completed | Format: ISO 8601 |

### Sample Records:

```
Date: 2025-11-30
Name: Mental Math Practice
Duration: 20-30 questions
Emoji: 🧮
Category: math
Order: 1
Completed: false

Date: 2025-11-30
Name: Reading & Communication (Session 1)
Duration: 30 minutes
Emoji: 📚
Category: reading
Order: 2
Completed: false

...etc
```

---

## Table 2: MathProgress

This table tracks Zion's mental math practice and progress.

### Fields:

| Field Name | Field Type | Description | Options |
|------------|-----------|-------------|---------|
| SessionId | Single line text | Unique ID for each practice session | |
| QuestionId | Single line text | Unique ID for each question | |
| Date | Date | Date of the practice session | Format: Local date |
| Timestamp | Date | Exact time question was created | Format: ISO 8601 |
| Question | Single line text | The math problem | e.g., "47 + 36" |
| Answer | Number | Correct answer | Integer |
| Type | Single select | Type of problem | Options: addition, subtraction, multiplication, division |
| Difficulty | Single select | Difficulty level | Options: easy, medium, hard |
| StudentAnswer | Number | Zion's answer | Integer, can be empty |
| IsCorrect | Checkbox | Whether the answer was correct | |
| AnsweredAt | Date | When Zion answered | Format: ISO 8601 |
| SessionProgress | Single line text | Progress in session | e.g., "15/20" |

### Sample Records:

```
SessionId: session-2025-11-30-morning
QuestionId: q-1701342000000-0
Date: 2025-11-30
Question: 47 + 36
Answer: 83
Type: addition
Difficulty: medium
StudentAnswer: 83
IsCorrect: true
AnsweredAt: 2025-11-30T14:32:15Z
SessionProgress: 1/20
```

---

## Table 3: LessonHistory (Optional - for tracking long-term progress)

This table stores historical data about Zion's learning sessions.

### Fields:

| Field Name | Field Type | Description |
|------------|-----------|-------------|
| Date | Date | Date of the lesson |
| SessionId | Single line text | Unique session ID |
| Duration | Number | Total minutes in session |
| MathCompleted | Checkbox | Whether math was completed |
| MathScore | Number | Score on math (0-100) |
| ReadingCompleted | Checkbox | Whether reading was completed |
| ScienceCompleted | Checkbox | Whether science was completed |
| Notes | Long text | Notes from the session |
| TotalTasksCompleted | Number | Number of tasks completed |
| EngagementLevel | Single select | How engaged Zion was (Options: low, medium, high) |

---

## Getting Your AirTable Credentials

### 1. Get Your API Key

1. Go to [airtable.com/account](https://airtable.com/account)
2. Scroll to "API" section
3. Click "Generate API key"
4. Copy the key (starts with "key...")

### 2. Get Your Base ID

1. Go to [airtable.com/api](https://airtable.com/api)
2. Select your base
3. In the URL, you'll see: `https://airtable.com/[BASE_ID]/api/docs`
4. The BASE_ID starts with "app..."

### 3. Table Names

Use the exact names as shown above:
- `DailyTasks`
- `MathProgress`
- `LessonHistory` (if using)

Or use custom names and update the `AIRTABLE_TABLE_NAME` environment variable.

---

## Setting Up Environment Variables

Add these to your `.env` file:

```bash
AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_TABLE_NAME=DailyTasks
```

---

## Automation Ideas

### Daily Reset (8 AM)

You can set up an AirTable automation to:
1. Trigger: Every day at 8:00 AM
2. Action: Delete all records from yesterday in DailyTasks
3. Action: Create new records using a template

OR let the app handle it (currently implemented in the code).

### Weekly Summary

1. Trigger: Every Sunday at 6:00 PM
2. Action: Send email with week's progress
3. Include: Total tasks completed, math scores, engagement levels

---

## Views

Create these views in AirTable for better organization:

### DailyTasks Views:
- **Today**: Filter by `Date = TODAY()`
- **Completed**: Filter by `Completed = true`
- **Pending**: Filter by `Completed = false`
- **By Category**: Group by `Category`

### MathProgress Views:
- **Today's Progress**: Filter by `Date = TODAY()`
- **Correct Answers**: Filter by `IsCorrect = true`
- **By Difficulty**: Group by `Difficulty`
- **Session Summary**: Group by `SessionId`

---

## Optional: OAuth Integration

For production use, you may want to implement OAuth instead of using API keys directly.

AirTable OAuth documentation: [airtable.com/developers/web/guides/oauth-integrations](https://airtable.com/developers/web/guides/oauth-integrations)

This allows:
- More secure authentication
- Better permission scoping
- Easier sharing with team members

---

## Testing Your Setup

1. Create the tables with the fields above
2. Add your credentials to `.env`
3. Start the server: `npm run server`
4. Test the API: `curl http://localhost:3001/api/tasks/today`
5. You should see default tasks created automatically

---

## Support

If you need help setting up AirTable:
- [AirTable Support](https://support.airtable.com)
- [AirTable API Documentation](https://airtable.com/developers/web/api/introduction)
