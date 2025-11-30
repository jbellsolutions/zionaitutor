const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * Get today's tasks from AirTable
 */
export const getTodaysTasks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/today`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    const data = await response.json();
    return data.tasks || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    // Return default tasks if API fails
    return getDefaultTasks();
  }
};

/**
 * Update task completion status
 */
export const updateTaskStatus = async (taskId, completed) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    });

    if (!response.ok) {
      throw new Error('Failed to update task');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

/**
 * Check if daily reset is needed and perform it
 */
export const checkAndResetDaily = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/check-reset`);
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    return data.wasReset || false;
  } catch (error) {
    console.error('Error checking reset:', error);
    return false;
  }
};

/**
 * Get default tasks if AirTable is not set up yet
 */
const getDefaultTasks = () => {
  return [
    {
      id: 'task-1',
      name: 'Mental Math Practice',
      duration: '20-30 questions',
      emoji: '🧮',
      completed: false,
      category: 'math'
    },
    {
      id: 'task-2',
      name: 'Reading & Communication (Session 1)',
      duration: '30 minutes',
      emoji: '📚',
      completed: false,
      category: 'reading'
    },
    {
      id: 'task-3',
      name: 'Reading & Communication (Session 2)',
      duration: '30 minutes',
      emoji: '✍️',
      completed: false,
      category: 'reading'
    },
    {
      id: 'task-4',
      name: 'Space & Science Exploration',
      duration: '20 minutes',
      emoji: '🚀',
      completed: false,
      category: 'science'
    },
    {
      id: 'task-5',
      name: 'Piano Practice',
      duration: '20 minutes',
      emoji: '🎹',
      link: 'https://your-piano-app-link.com',
      completed: false,
      category: 'music'
    },
    {
      id: 'task-6',
      name: 'Math on Doodle App',
      duration: '20 minutes',
      emoji: '🎯',
      link: 'https://www.doodlelearning.com',
      completed: false,
      category: 'math'
    }
  ];
};
