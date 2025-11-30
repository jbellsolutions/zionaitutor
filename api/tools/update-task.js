const Airtable = require('airtable');

// Initialize AirTable
const base = process.env.AIRTABLE_API_KEY
  ? new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID)
  : null;

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
    const { taskId, completed, taskName } = req.body;

    if (!base) {
      return res.status(200).json({
        success: true,
        message: 'Task updated (AirTable not configured)'
      });
    }

    // Find and update the task
    const today = new Date().toDateString();
    const records = await base('DailyTasks')
      .select({
        filterByFormula: `AND({Date} = '${today}', {Name} = '${taskName}')`
      })
      .all();

    if (records.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const record = await base('DailyTasks').update(records[0].id, {
      Completed: completed,
      CompletedAt: completed ? new Date().toISOString() : null
    });

    res.status(200).json({
      success: true,
      task: {
        id: record.id,
        name: record.fields.Name,
        completed: record.fields.Completed
      }
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};
