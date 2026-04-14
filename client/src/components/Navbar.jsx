import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" id="navbar-brand">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="url(#navGrad)" />
            <path d="M9 16.5l4 4 10-10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="navGrad" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <span>TaskManager</span>
        </Link>

        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <div className="navbar-user-info">
                <span className="navbar-greeting">
                  Hello, <strong>{user?.name}</strong>
                </span>
                {isAdmin && <span className="admin-badge" id="admin-badge">Admin</span>}
              </div>
              <Link to="/dashboard" className="nav-link" id="nav-dashboard">
                Dashboard
              </Link>
              {isAdmin && (
                <Link to="/admin" className="nav-link" id="nav-admin">
                  👥 Users
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                id="nav-logout-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" id="nav-login">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="nav-register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
