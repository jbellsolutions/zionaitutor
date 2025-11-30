const Airtable = require('airtable');

// Initialize AirTable
const base = process.env.AIRTABLE_API_KEY
  ? new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID)
  : null;

const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'DailyTasks';

/**
 * Get default tasks template
 */
function getDefaultTasks() {
  return [
    {
      id: 'task-1',
      name: 'Mental Math Practice',
      duration: '20-30 questions',
      emoji: '🧮',
      category: 'math',
      completed: false
    },
    {
      id: 'task-2',
      name: 'Reading & Communication (Session 1)',
      duration: '30 minutes',
      emoji: '📚',
      category: 'reading',
      completed: false
    },
    {
      id: 'task-3',
      name: 'Reading & Communication (Session 2)',
      duration: '30 minutes',
      emoji: '✍️',
      category: 'reading',
      completed: false
    },
    {
      id: 'task-4',
      name: 'Space & Science Exploration',
      duration: '20 minutes',
      emoji: '🚀',
      category: 'science',
      completed: false
    },
    {
      id: 'task-5',
      name: 'Piano Practice',
      duration: '20 minutes',
      emoji: '🎹',
      link: process.env.PIANO_APP_URL || '',
      category: 'music',
      completed: false
    },
    {
      id: 'task-6',
      name: 'Math on Doodle App',
      duration: '20 minutes',
      emoji: '🎯',
      link: 'https://www.doodlelearning.com',
      category: 'math',
      completed: false
    }
  ];
}

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

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (!base) {
      // Return default tasks if AirTable is not configured
      return res.status(200).json({ tasks: getDefaultTasks() });
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
      return res.status(200).json({ tasks });
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

    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};
