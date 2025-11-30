import React, { useState, useEffect } from 'react';
import './App.css';
import VoiceWidget from './components/VoiceWidget';
import DailyChecklist from './components/DailyChecklist';
import { getTodaysTasks, updateTaskStatus, checkAndResetDaily } from './services/airtable';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Load tasks on mount and set up daily refresh
  useEffect(() => {
    loadTasks();

    // Update date every minute
    const dateInterval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    // Check for daily reset every minute
    const resetInterval = setInterval(async () => {
      const needsReset = await checkAndResetDaily();
      if (needsReset) {
        await loadTasks();
      }
    }, 60000);

    return () => {
      clearInterval(dateInterval);
      clearInterval(resetInterval);
    };
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const tasksData = await getTodaysTasks();
      setTasks(tasksData);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskToggle = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const newStatus = !task.completed;

      // Optimistic update
      setTasks(tasks.map(t =>
        t.id === taskId ? { ...t, completed: newStatus } : t
      ));

      // Update in AirTable
      await updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error('Error updating task:', err);
      // Revert on error
      await loadTasks();
      setError('Failed to update task. Please try again.');
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🚀 Zion's Growth Home Base</h1>
        <p>Your daily adventure in learning!</p>
        <div className="date-display">
          {formatDate(currentDate)}
        </div>
      </header>

      <main className="main-content">
        {/* Voice Widget - Takes center stage */}
        <section className="voice-section">
          <VoiceWidget onTaskUpdate={loadTasks} />
        </section>

        {/* Daily Checklist */}
        <section className="checklist-section">
          <h2>Today's Learning Goals</h2>
          {loading ? (
            <div className="loading">Loading your tasks...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <DailyChecklist
              tasks={tasks}
              onTaskToggle={handleTaskToggle}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
