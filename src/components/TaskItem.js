import React from 'react';
import './TaskItem.css';

const TaskItem = ({ task, onToggle }) => {
  const { name, duration, link, completed, emoji } = task;

  return (
    <div className={`task-item ${completed ? 'completed' : ''}`}>
      <div className="task-checkbox-container">
        <input
          type="checkbox"
          checked={completed}
          onChange={onToggle}
          className="task-checkbox"
          id={`task-${task.id}`}
        />
        <label htmlFor={`task-${task.id}`} className="checkbox-label">
          <svg className="checkbox-icon" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </label>
      </div>

      <div className="task-content">
        <div className="task-header">
          {emoji && <span className="task-emoji">{emoji}</span>}
          <h3 className="task-name">{name}</h3>
        </div>

        {duration && (
          <div className="task-duration">
            ⏱️ {duration}
          </div>
        )}

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="task-link"
            onClick={(e) => e.stopPropagation()}
          >
            🔗 Open Activity
          </a>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
