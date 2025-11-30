const express = require('express');
const router = express.Router();
const Airtable = require('airtable');

// Initialize AirTable
const base = process.env.AIRTABLE_API_KEY
  ? new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID)
  : null;

const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'DailyTasks';

// Store last reset date in memory (in production, use a database)
let lastResetDate = new Date().toDateString();

/**
 * GET /api/tasks/today
 * Get today's tasks
 */
router.get('/today', async (req, res) => {
  try {
    if (!base) {
      // Return default tasks if AirTable is not configured
      return res.json({ tasks: getDefaultTasks() });
    }

    const today = new Date().toDateString();
    const records = await base(TABLE_NAME)
      .select({
        filterByFormula: `{Date} = '${today}'`,
        sort: [{ field: 'Order', direction: 'asc' }]
      })
      .all();

    if (records.length === 0) {
      // No tasks for today, create default tasks
      const tasks = await createDefaultTasksForToday();
      return res.json({ tasks });
    }

    const tasks = records.map(record => ({
      id: record.id,
      name: record.fields.Name,
      duration: record.fields.Duration,
      emoji: record.fields.Emoji,
      link: record.fields.Link,
      completed: record.fields.Completed || false,
      category: record.fields.Category,
      order: record.fields.Order
    }));

    res.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

/**
 * PATCH /api/tasks/:id
 * Update task completion status
 */
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    if (!base) {
      return res.json({ success: true, id, completed });
    }

    const record = await base(TABLE_NAME).update(id, {
      Completed: completed,
      CompletedAt: completed ? new Date().toISOString() : null
    });

    res.json({
      success: true,
      task: {
        id: record.id,
        completed: record.fields.Completed
      }
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

/**
 * GET /api/tasks/check-reset
 * Check if daily reset is needed
 */
router.get('/check-reset', async (req, res) => {
  try {
    const today = new Date().toDateString();
    const currentHour = new Date().getHours();

    // Reset at 8 AM
    if (lastResetDate !== today && currentHour >= 8) {
      lastResetDate = today;

      if (base) {
        await createDefaultTasksForToday();
      }

      return res.json({ wasReset: true, date: today });
    }

    res.json({ wasReset: false, date: today });
  } catch (error) {
    console.error('Error checking reset:', error);
    res.status(500).json({ error: 'Failed to check reset' });
  }
});

/**
 * Helper function to create default tasks for today
 */
async function createDefaultTasksForToday() {
  if (!base) {
    return getDefaultTasks();
  }

  const today = new Date().toDateString();
  const defaultTasks = getDefaultTasks();

  const records = await Promise.all(
    defaultTasks.map((task, index) =>
      base(TABLE_NAME).create({
        Date: today,
        Name: task.name,
        Duration: task.duration,
        Emoji: task.emoji,
        Link: task.link || '',
        Category: task.category,
        Order: index + 1,
        Completed: false
      })
    )
  );

  return records.map(record => ({
    id: record.id,
    name: record.fields.Name,
    duration: record.fields.Duration,
    emoji: record.fields.Emoji,
    link: record.fields.Link,
    completed: false,
    category: record.fields.Category,
    order: record.fields.Order
  }));
}

/**
 * Get default tasks template
 */
function getDefaultTasks() {
  return [
    {
      name: 'Mental Math Practice',
      duration: '20-30 questions',
      emoji: '🧮',
      category: 'math',
      completed: false
    },
    {
      name: 'Reading & Communication (Session 1)',
      duration: '30 minutes',
      emoji: '📚',
      category: 'reading',
      completed: false
    },
    {
      name: 'Reading & Communication (Session 2)',
      duration: '30 minutes',
      emoji: '✍️',
      category: 'reading',
      completed: false
    },
    {
      name: 'Space & Science Exploration',
      duration: '20 minutes',
      emoji: '🚀',
      category: 'science',
      completed: false
    },
    {
      name: 'Piano Practice',
      duration: '20 minutes',
      emoji: '🎹',
      link: process.env.PIANO_APP_URL || '',
      category: 'music',
      completed: false
    },
    {
      name: 'Math on Doodle App',
      duration: '20 minutes',
      emoji: '🎯',
      link: 'https://www.doodlelearning.com',
      category: 'math',
      completed: false
    }
  ];
}

module.exports = router;
