import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="site-header">
      <div className="header-wrap">
        <Link to={user ? "/today" : "/"} className="brand-title">
          <span>Hourlee</span>
        </Link>

        {user && (
          <nav className="nav-row">
            <Link to="/today" className={`nav-link ${isActive('/today') ? 'active' : ''}`}>
              Today
            </Link>
            <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`}>
              History
            </Link>
            <Link to="/analytics" className={`nav-link ${isActive('/analytics') ? 'active' : ''}`}>
              Analytics
            </Link>
            <Link to="/settings" className={`nav-link ${isActive('/settings') ? 'active' : ''}`}>
              Settings
            </Link>
          </nav>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ThemeToggle />

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="btn-action btn-action-quiet"
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                Log Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/login" className="btn-action btn-action-quiet">
                Log in
              </Link>
              <Link to="/signup" className="btn-action btn-action-dark">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
