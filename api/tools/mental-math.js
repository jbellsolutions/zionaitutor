const Airtable = require('airtable');

// Initialize AirTable
const base = process.env.AIRTABLE_API_KEY
  ? new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID)
  : null;

// In-memory store (Note: This resets with each deployment/cold start)
// For production, consider using Redis or a database
const sessionData = new Map();

/**
 * Generate a single math question based on difficulty
 */
function generateSingleQuestion(difficulty) {
  const types = ['addition', 'subtraction', 'multiplication'];
  const type = types[Math.floor(Math.random() * types.length)];

  let num1, num2, answer, question;

  switch (difficulty) {
    case 'easy':
      num1 = Math.floor(Math.random() * 20) + 10; // 10-29
      num2 = Math.floor(Math.random() * 20) + 10;
      break;
    case 'medium':
      num1 = Math.floor(Math.random() * 50) + 20; // 20-69
      num2 = Math.floor(Math.random() * 50) + 20;
      break;
    case 'hard':
      num1 = Math.floor(Math.random() * 100) + 50; // 50-149
      num2 = Math.floor(Math.random() * 100) + 50;
      break;
    default:
      num1 = Math.floor(Math.random() * 50) + 20;
      num2 = Math.floor(Math.random() * 50) + 20;
  }

  switch (type) {
    case 'addition':
      answer = num1 + num2;
      question = `${num1} + ${num2}`;
      break;
    case 'subtraction':
      // Ensure positive result
      if (num1 < num2) [num1, num2] = [num2, num1];
      answer = num1 - num2;
      question = `${num1} - ${num2}`;
      break;
    case 'multiplication':
      // Use smaller numbers for multiplication
      num1 = Math.floor(Math.random() * 9) + 2; // 2-10
      num2 = Math.floor(Math.random() * 9) + 2;
      answer = num1 * num2;
      question = `${num1} × ${num2}`;
      break;
  }

  return { question, answer, type, num1, num2 };
}

/**
 * Generate mental math questions
 */
function generateMathQuestions(difficulty, count) {
  const questions = [];

  for (let i = 0; i < count; i++) {
    const question = generateSingleQuestion(difficulty);
    questions.push({
      id: `q-${Date.now()}-${i}`,
      ...question,
      difficulty,
      createdAt: new Date()
    });
  }

  return questions;
}

/**
 * Get encouraging feedback
 */
function getEncouragement(isCorrect, session) {
  const correctResponses = [
    "Excellent work, Zion! You got it!",
    "Perfect! You're really good at this!",
    "That's right! Great job!",
    "Awesome! You're on fire!",
    "Correct! Keep up the great work!"
  ];

  const incorrectResponses = [
    "Not quite, but great effort! Let's think through it together.",
    "That's okay! Let me help you understand this one.",
    "Good try! Here's how to solve it step by step...",
    "You're close! Let's work through it again."
  ];

  const responses = isCorrect ? correctResponses : incorrectResponses;
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];

  if (session.totalCount % 5 === 0 && session.totalCount > 0) {
    const percentage = Math.round((session.correctCount / session.totalCount) * 100);
    return `${randomResponse} You've completed ${session.totalCount} problems with ${percentage}% accuracy!`;
  }

  return randomResponse;
}

/**
 * Save math questions to AirTable
 */
async function saveMathQuestionsToAirtable(sessionId, questions) {
  if (!base) return;

  try {
    await Promise.all(
      questions.map(q =>
        base('MathProgress').create({
          SessionId: sessionId,
          QuestionId: q.id,
          Question: q.question,
          Answer: q.answer,
          Type: q.type,
          Difficulty: q.difficulty,
          Date: new Date().toDateString(),
          Timestamp: new Date().toISOString()
        })
      )
    );
  } catch (error) {
    console.error('Error saving questions to AirTable:', error);
  }
}

/**
 * Save math progress to AirTable
 */
async function saveMathProgressToAirtable(sessionId, question, session) {
  if (!base) return;

  try {
    const records = await base('MathProgress')
      .select({
        filterByFormula: `{QuestionId} = '${question.id}'`
      })
      .all();

    if (records.length > 0) {
      await base('MathProgress').update(records[0].id, {
        StudentAnswer: question.studentAnswer,
        IsCorrect: question.isCorrect,
        AnsweredAt: question.answeredAt.toISOString(),
        SessionProgress: `${session.correctCount}/${session.totalCount}`
      });
    }
  } catch (error) {
    console.error('Error saving progress to AirTable:', error);
  }
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
    const { action, sessionId, difficulty, count, answer, questionId } = req.body;

    switch (action) {
      case 'generate':
        const questions = generateMathQuestions(difficulty || 'medium', count || 5);

        if (!sessionData.has(sessionId)) {
          sessionData.set(sessionId, {
            questions: [],
            correctCount: 0,
            totalCount: 0,
            startTime: new Date()
          });
        }

        const session = sessionData.get(sessionId);
        session.questions.push(...questions);

        if (base) {
          await saveMathQuestionsToAirtable(sessionId, questions);
        }

        return res.status(200).json({
          success: true,
          questions,
          totalGenerated: session.questions.length
        });

      case 'check-answer':
        if (!sessionData.has(sessionId)) {
          return res.status(400).json({ error: 'Session not found' });
        }

        const currentSession = sessionData.get(sessionId);
        const question = currentSession.questions.find(q => q.id === questionId);

        if (!question) {
          return res.status(400).json({ error: 'Question not found' });
        }

        const isCorrect = parseInt(answer) === question.answer;
        question.studentAnswer = parseInt(answer);
        question.isCorrect = isCorrect;
        question.answeredAt = new Date();

        currentSession.totalCount++;
        if (isCorrect) {
          currentSession.correctCount++;
        }

        if (base) {
          await saveMathProgressToAirtable(sessionId, question, currentSession);
        }

        return res.status(200).json({
          success: true,
          isCorrect,
          correctAnswer: question.answer,
          progress: {
            correct: currentSession.correctCount,
            total: currentSession.totalCount,
            percentage: Math.round((currentSession.correctCount / currentSession.totalCount) * 100)
          },
          encouragement: getEncouragement(isCorrect, currentSession)
        });

      case 'get-progress':
        if (!sessionData.has(sessionId)) {
          return res.status(200).json({
            success: true,
            progress: { correct: 0, total: 0, percentage: 0 }
          });
        }

        const progressSession = sessionData.get(sessionId);
        return res.status(200).json({
          success: true,
          progress: {
            correct: progressSession.correctCount,
            total: progressSession.totalCount,
            percentage: Math.round((progressSession.correctCount / progressSession.totalCount) * 100)
          }
        });

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Error in mental-math tool:', error);
    res.status(500).json({ error: 'Failed to process mental math request' });
  }
};
