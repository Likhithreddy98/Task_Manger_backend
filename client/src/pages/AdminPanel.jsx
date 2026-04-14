import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import API from '../api/axios';

const AdminPanel = ({ showToast }) => {
  const { isAdmin, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);


  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const fetchUsers = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;

      const res = await API.get('/users', { params });
      setUsers(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      showToast('Failed to fetch users.', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, showToast]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await API.get('/users/stats');
      setStats(res.data.data);
    } catch (err) {

    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [fetchUsers, fetchStats]);

  const handleRoleChange = async (userId, newRole) => {
    setActionLoading(true);
    try {
      await API.put(`/users/${userId}/role`, { role: newRole });
      showToast(`User role updated to '${newRole}'.`, 'success');
      setConfirmAction(null);
      fetchUsers();
      fetchStats();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update role.';
      showToast(message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    setActionLoading(true);
    try {
      await API.delete(`/users/${userId}`);
      showToast('User deleted successfully.', 'success');
      setConfirmAction(null);
      fetchUsers();
      fetchStats();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete user.';
      showToast(message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="admin-panel" id="admin-panel-page">
      {}
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1>👥 User Management</h1>
          <p>Manage users, roles, and permissions</p>
        </div>
      </div>

      {}
      {stats && (
        <div className="task-stats">
          <div className="stat-card glass-card">
            <span className="stat-number">{stats.totalUsers + stats.totalAdmins}</span>
            <span className="stat-label">Total Users</span>
          </div>
          <div className="stat-card glass-card stat-progress">
            <span className="stat-number">{stats.totalUsers}</span>
            <span className="stat-label">Users</span>
          </div>
          <div className="stat-card glass-card stat-completed">
            <span className="stat-number">{stats.totalAdmins}</span>
            <span className="stat-label">Admins</span>
          </div>
          <div className="stat-card glass-card stat-pending">
            <span className="stat-number">{stats.totalTasks}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
        </div>
      )}

      {}
      <div className="admin-controls">
        <div className="admin-search">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            id="admin-search-input"
          />
        </div>
        <div className="admin-filter-group">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="form-input form-select"
            id="admin-role-filter"
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {}
      {loading ? (
        <div className="tasks-loading">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton-card glass-card" style={{ height: '60px' }} />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="empty-state" id="no-users-state">
          <div className="empty-icon">👤</div>
          <h3>No users found</h3>
          <p>No users match your search criteria.</p>
        </div>
      ) : (
        <div className="admin-table-container glass-card">
          <table className="admin-table" id="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Auth</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} id={`user-row-${u._id}`}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-info">
                        <span className="user-name">{u.name}</span>
                        <span className="user-email">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge role-${u.role}`}>
                      {u.role === 'admin' ? '🛡️' : '👤'} {u.role}
                    </span>
                  </td>
                  <td className="text-muted">{formatDate(u.createdAt)}</td>
                  <td>
                    <span className={`auth-type-badge ${u.googleId ? 'auth-google' : 'auth-local'}`}>
                      {u.googleId ? '🔗 Google' : '📧 Local'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      {u.role === 'user' ? (
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setConfirmAction({ type: 'promote', userId: u._id, userName: u.name })}
                          title="Promote to Admin"
                        >
                          ⬆ Promote
                        </button>
                      ) : (
                        u._id !== user._id && (
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setConfirmAction({ type: 'demote', userId: u._id, userName: u.name })}
                            title="Demote to User"
                          >
                            ⬇ Demote
                          </button>
                        )
                      )}
                      {u.role !== 'admin' && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setConfirmAction({ type: 'delete', userId: u._id, userName: u.name })}
                          title="Delete User"
                        >
                          🗑
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {}
      {pagination.pages > 1 && (
        <div className="pagination" id="admin-pagination">
          <button
            className="btn btn-outline btn-sm"
            disabled={pagination.page <= 1}
            onClick={() => fetchUsers(pagination.page - 1)}
          >
            ← Previous
          </button>
          <span className="pagination-info">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            className="btn btn-outline btn-sm"
            disabled={pagination.page >= pagination.pages}
            onClick={() => fetchUsers(pagination.page + 1)}
          >
            Next →
          </button>
        </div>
      )}

      {}
      {confirmAction && (
        <div className="modal-overlay" id="confirm-modal">
          <div className="modal-card glass-card">
            <h3>
              {confirmAction.type === 'delete' && '🗑️ Delete User'}
              {confirmAction.type === 'promote' && '⬆️ Promote User'}
              {confirmAction.type === 'demote' && '⬇️ Demote User'}
            </h3>
            <p>
              {confirmAction.type === 'delete' &&
                `Are you sure you want to delete "${confirmAction.userName}"? All their tasks will also be deleted. This action cannot be undone.`}
              {confirmAction.type === 'promote' &&
                `Promote "${confirmAction.userName}" to Admin? They will be able to manage all users and tasks.`}
              {confirmAction.type === 'demote' &&
                `Demote "${confirmAction.userName}" to User? They will only be able to manage their own tasks.`}
            </p>
            <div className="modal-actions">
              <button
                className={`btn ${confirmAction.type === 'delete' ? 'btn-danger' : 'btn-primary'}`}
                onClick={() => {
                  if (confirmAction.type === 'delete') {
                    handleDeleteUser(confirmAction.userId);
                  } else if (confirmAction.type === 'promote') {
                    handleRoleChange(confirmAction.userId, 'admin');
                  } else {
                    handleRoleChange(confirmAction.userId, 'user');
                  }
                }}
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : 'Confirm'}
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => setConfirmAction(null)}
                disabled={actionLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
