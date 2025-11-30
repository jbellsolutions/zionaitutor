const express = require('express');
const router = express.Router();
const Airtable = require('airtable');
const axios = require('axios');

// Initialize AirTable
const base = process.env.AIRTABLE_API_KEY
  ? new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID)
  : null;

// Store for current session data
const sessionData = new Map();

/**
 * POST /api/tools/mental-math
 * Generate mental math questions and track progress
 */
router.post('/mental-math', async (req, res) => {
  try {
    const { action, sessionId, difficulty, count, answer, questionId } = req.body;

    switch (action) {
      case 'generate':
        // Generate a batch of math questions
        const questions = generateMathQuestions(difficulty || 'medium', count || 5);

        // Store in session
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

        // Save to AirTable if configured
        if (base) {
          await saveMathQuestionsToAirtable(sessionId, questions);
        }

        return res.json({
          success: true,
          questions,
          totalGenerated: session.questions.length
        });

      case 'check-answer':
        // Check student's answer
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

        // Save progress to AirTable
        if (base) {
          await saveMathProgressToAirtable(sessionId, question, currentSession);
        }

        return res.json({
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
        // Get current progress
        if (!sessionData.has(sessionId)) {
          return res.json({
            success: true,
            progress: { correct: 0, total: 0, percentage: 0 }
          });
        }

        const progressSession = sessionData.get(sessionId);
        return res.json({
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
});

/**
 * POST /api/tools/search
 * Search for information (educational content)
 */
router.post('/search', async (req, res) => {
  try {
    const { query, category } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Use a search API or knowledge base
    // For now, return curated educational content
    const results = await searchEducationalContent(query, category);

    res.json({
      success: true,
      query,
      results
    });
  } catch (error) {
    console.error('Error in search tool:', error);
    res.status(500).json({ error: 'Failed to search' });
  }
});

/**
 * POST /api/tools/update-task
 * Update task status (called by Vapi assistant)
 */
router.post('/update-task', async (req, res) => {
  try {
    const { taskId, completed, taskName } = req.body;

    if (!base) {
      return res.json({ success: true, message: 'Task updated (AirTable not configured)' });
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

    res.json({
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
});

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
 * Get encouraging feedback based on performance
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

  // Add progress milestone encouragement
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

/**
 * Search educational content
 */
async function searchEducationalContent(query, category) {
  // This is a simplified version. In production, you might use:
  // - Wikipedia API
  // - Educational APIs
  // - Your own knowledge base

  const knowledgeBase = {
    space: {
      'black hole': 'A black hole is a region in space where gravity is so strong that nothing, not even light, can escape from it. They form when massive stars collapse.',
      'neutron star': 'A neutron star is an incredibly dense object that forms when a massive star explodes. A teaspoon of neutron star material would weigh as much as a mountain!',
      'planet': 'A planet is a large object that orbits a star. Our solar system has 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.',
      'galaxy': 'A galaxy is a huge collection of billions of stars, gas, and dust held together by gravity. We live in the Milky Way galaxy.'
    },
    science: {
      'tornado': 'A tornado is a violent rotating column of air that extends from a thunderstorm to the ground. They can have winds over 300 mph!',
      'lightning': 'Lightning is a giant spark of electricity in the atmosphere. It can be 5 times hotter than the surface of the Sun!',
      'hurricane': 'A hurricane is a huge storm that forms over warm ocean water. It has powerful winds that spin around a calm center called the eye.'
    },
    math: {
      'multiplication': 'Multiplication is repeated addition. For example, 5 × 4 means adding 5 four times: 5 + 5 + 5 + 5 = 20.',
      'fraction': 'A fraction represents a part of a whole. Like if you cut a pizza into 8 slices and eat 3, you ate 3/8 of the pizza.'
    }
  };

  const results = [];
  const searchQuery = query.toLowerCase();

  // Search in knowledge base
  for (const [cat, topics] of Object.entries(knowledgeBase)) {
    if (!category || category === cat) {
      for (const [topic, content] of Object.entries(topics)) {
        if (searchQuery.includes(topic) || topic.includes(searchQuery)) {
          results.push({
            topic,
            category: cat,
            content,
            relevance: 'high'
          });
        }
      }
    }
  }

  // If no results, return a helpful message
  if (results.length === 0) {
    results.push({
      topic: 'Information',
      content: `I don't have specific information about "${query}" in my knowledge base yet. Let me help you explore this topic by asking you what you already know about it, or we can look it up together!`,
      relevance: 'medium'
    });
  }

  return results;
}

module.exports = router;
