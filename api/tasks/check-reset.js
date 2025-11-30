// Note: In Vercel, we can't maintain state between function calls
// This is a simplified version - consider using a database or external storage for production

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
    const today = new Date().toDateString();
    const currentHour = new Date().getHours();

    // In serverless, we check the current time
    // The frontend will handle creating new tasks when needed
    res.status(200).json({
      wasReset: false,
      date: today,
      currentHour,
      shouldReset: currentHour >= 8
    });
  } catch (error) {
    console.error('Error checking reset:', error);
    res.status(500).json({ error: 'Failed to check reset' });
  }
};
