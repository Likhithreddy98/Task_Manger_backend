import { useState } from 'react';

const TaskForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'pending',
  });
  const [loading, setLoading] = useState(false);

  const isEditing = !!initialData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      if (!isEditing) {
        setFormData({ title: '', description: '', status: 'pending' });
      }
    } catch (err) {

    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} id={isEditing ? 'edit-task-form' : 'create-task-form'}>
      <h3 className="task-form-title">
        {isEditing ? '✏️ Edit Task' : '➕ New Task'}
      </h3>

      <div className="form-group">
        <label htmlFor="task-title">Title</label>
        <input
          type="text"
          id="task-title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title..."
          required
          maxLength={100}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description (optional)..."
          maxLength={500}
          rows={3}
          className="form-input form-textarea"
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-status">Status</label>
        <select
          id="task-status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="form-input form-select"
        >
          <option value="pending">🟡 Pending</option>
          <option value="in-progress">🔵 In Progress</option>
          <option value="completed">🟢 Completed</option>
        </select>
      </div>

      <div className="task-form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !formData.title.trim()}
          id={isEditing ? 'update-task-btn' : 'create-task-btn'}
        >
          {loading ? (
            <span className="btn-loading">
              <span className="loading-spinner-sm" />
              {isEditing ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            isEditing ? 'Update Task' : 'Create Task'
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancel}
            id="cancel-edit-btn"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
