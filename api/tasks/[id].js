const Airtable = require('airtable');

// Initialize AirTable
const base = process.env.AIRTABLE_API_KEY
  ? new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID)
  : null;

const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'DailyTasks';

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
    const { id } = req.query;
    const { completed } = req.body;

    if (!base) {
      return res.status(200).json({ success: true, id, completed });
    }

    const record = await base(TABLE_NAME).update(id, {
      Completed: completed,
      CompletedAt: completed ? new Date().toISOString() : null
    });

    res.status(200).json({
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
};
