import React from 'react';
import TaskItem from './TaskItem';
import './DailyChecklist.css';

const DailyChecklist = ({ tasks, onTaskToggle }) => {
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="daily-checklist">
      <div className="progress-section">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="progress-text">
          {completedCount} of {totalCount} tasks completed ({Math.round(progressPercent)}%)
        </div>
      </div>

      <div className="tasks-list">
        {tasks.length === 0 ? (
          <div className="no-tasks">
            <p>No tasks for today yet!</p>
            <p>Talk to your tutor to get started.</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => onTaskToggle(task.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default DailyChecklist;
