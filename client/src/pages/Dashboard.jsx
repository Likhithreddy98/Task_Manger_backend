import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';

const Dashboard = ({ showToast }) => {
  const { user, isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [stats, setStats] = useState({ total: 0, pending: 0, 'in-progress': 0, completed: 0 });


  const fetchStats = useCallback(async () => {
    try {

      const [allRes, pendingRes, progressRes, completedRes] = await Promise.all([
        API.get('/tasks', { params: { limit: 1 } }),
        API.get('/tasks', { params: { status: 'pending', limit: 1 } }),
        API.get('/tasks', { params: { status: 'in-progress', limit: 1 } }),
        API.get('/tasks', { params: { status: 'completed', limit: 1 } }),
      ]);
      setStats({
        total: allRes.data.pagination.total,
        pending: pendingRes.data.pagination.total,
        'in-progress': progressRes.data.pagination.total,
        completed: completedRes.data.pagination.total,
      });
    } catch (err) {

    }
  }, []);

  const fetchTasks = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: 12 };
      if (filter !== 'all') params.status = filter;

      const res = await API.get('/tasks', { params });
      setTasks(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      showToast('Failed to fetch tasks.', 'error');
    } finally {
      setLoading(false);
    }
  }, [filter, showToast]);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  const handleCreateTask = async (taskData) => {
    try {
      await API.post('/tasks', taskData);
      showToast('Task created successfully!', 'success');
      setShowCreateForm(false);
      fetchTasks();
      fetchStats();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create task.';
      showToast(message, 'error');
      throw err;
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await API.put(`/tasks/${editingTask._id}`, taskData);
      showToast('Task updated successfully!', 'success');
      setEditingTask(null);
      fetchTasks();
      fetchStats();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update task.';
      showToast(message, 'error');
      throw err;
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      showToast('Task deleted.', 'success');
      fetchTasks();
      fetchStats();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete task.';
      showToast(message, 'error');
      throw err;
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowCreateForm(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="dashboard" id="dashboard-page">
      {}
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1>
            {isAdmin ? '🛡️' : '📋'} Dashboard
          </h1>
          <p>
            {isAdmin
              ? 'Admin view — managing all tasks across users'
              : `Welcome back, ${user?.name}! Here are your tasks.`}
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setEditingTask(null);
          }}
          id="toggle-create-form-btn"
        >
          {showCreateForm ? '✕ Close' : '+ New Task'}
        </button>
      </div>

      {}
      {(showCreateForm || editingTask) && (
        <div className="dashboard-form-container glass-card">
          {editingTask ? (
            <TaskForm
              initialData={editingTask}
              onSubmit={handleUpdateTask}
              onCancel={() => setEditingTask(null)}
            />
          ) : (
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setShowCreateForm(false)}
            />
          )}
        </div>
      )}

      {}
      <div className="filter-bar" id="filter-bar">
        {['all', 'pending', 'in-progress', 'completed'].map((status) => (
          <button
            key={status}
            className={`filter-btn ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
            id={`filter-${status}`}
          >
            {status === 'all' && '📋'}
            {status === 'pending' && '🟡'}
            {status === 'in-progress' && '🔵'}
            {status === 'completed' && '🟢'}
            {' '}
            {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {}
      <div className="task-stats">
        <div className="stat-card glass-card">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat-card glass-card stat-pending">
          <span className="stat-number">{stats.pending}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card glass-card stat-progress">
          <span className="stat-number">{stats['in-progress']}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-card glass-card stat-completed">
          <span className="stat-number">{stats.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      {}
      {loading ? (
        <div className="tasks-loading">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton-card glass-card" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state" id="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No tasks found</h3>
          <p>
            {filter !== 'all'
              ? `No ${filter.replace('-', ' ')} tasks. Try changing the filter.`
              : "You haven't created any tasks yet. Click 'New Task' to get started!"}
          </p>
        </div>
      ) : (
        <>
          <div className="tasks-grid" id="tasks-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                isAdmin={isAdmin}
              />
            ))}
          </div>

          {}
          {pagination.pages > 1 && (
            <div className="pagination" id="pagination">
              <button
                className="btn btn-outline btn-sm"
                disabled={pagination.page <= 1}
                onClick={() => fetchTasks(pagination.page - 1)}
              >
                ← Previous
              </button>
              <span className="pagination-info">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                className="btn btn-outline btn-sm"
                disabled={pagination.page >= pagination.pages}
                onClick={() => fetchTasks(pagination.page + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;

