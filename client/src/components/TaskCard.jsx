import { useState } from 'react';

const statusConfig = {
  pending: { label: 'Pending', emoji: '🟡', className: 'status-pending' },
  'in-progress': { label: 'In Progress', emoji: '🔵', className: 'status-in-progress' },
  completed: { label: 'Completed', emoji: '🟢', className: 'status-completed' },
};


const timeAgo = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const TaskCard = ({ task, onEdit, onDelete, isAdmin }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const status = statusConfig[task.status] || statusConfig.pending;
  const owner = task.userId?.name || 'Unknown';
  const createdLabel = timeAgo(task.createdAt);
  const updatedLabel = task.updatedAt && task.updatedAt !== task.createdAt
    ? `Updated ${timeAgo(task.updatedAt)}`
    : null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(task._id);
    } catch (err) {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className={`task-card ${status.className}`} id={`task-card-${task._id}`}>
      <div className="task-card-header">
        <span className={`status-badge ${status.className}`}>
          {status.emoji} {status.label}
        </span>
        <div className="task-card-actions">
          <button
            className="btn-icon btn-edit"
            onClick={() => onEdit(task)}
            title="Edit task"
            id={`edit-btn-${task._id}`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className="btn-icon btn-delete"
            onClick={() => setShowConfirm(true)}
            title="Delete task"
            id={`delete-btn-${task._id}`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <h3 className="task-card-title">{task.title}</h3>

      {task.description && (
        <p className="task-card-description">{task.description}</p>
      )}

      <div className="task-card-meta">
        <span className="task-meta-item" title={new Date(task.createdAt).toLocaleString()}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1a6 6 0 100 12A6 6 0 007 1zM7 3.5V7l2.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          {createdLabel}
        </span>
        {updatedLabel && (
          <span className="task-meta-item task-updated" title={new Date(task.updatedAt).toLocaleString()}>
            ✏️ {updatedLabel}
          </span>
        )}
        {isAdmin && (
          <span className="task-meta-item task-owner">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M2 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {owner}
          </span>
        )}
      </div>

      {}
      {showConfirm && (
        <div className="task-card-overlay" id={`confirm-delete-${task._id}`}>
          <p>Delete this task?</p>
          <div className="confirm-actions">
            <button
              className="btn btn-danger btn-sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
