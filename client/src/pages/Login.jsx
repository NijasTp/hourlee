import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Login() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginId || !password) {
      setError('Please enter your username/email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(loginId, password);
      navigate('/today');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 140px)' }}>
        <div className="card-jitter" style={{ width: '100%', maxWidth: '460px', padding: '48px 40px' }}>
          <div style={{ marginBottom: '32px' }}>
            <span className="badge-kicker badge-lilac" style={{ marginBottom: '12px' }}>
              Hourlee Sign In
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '38px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
              Welcome back.
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '8px' }}>
              Sign in to view your living daily timeline.
            </p>
          </div>

          {error && (
            <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid rgba(225, 29, 72, 0.25)', color: '#e11d48', padding: '12px 18px', borderRadius: '16px', fontSize: '14px', marginBottom: '24px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Username or Email
              </label>
              <input
                type="text"
                className="input-pill"
                placeholder="Enter username or email"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Password
              </label>
              <input
                type="password"
                className="input-pill"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-pill btn-pill-dark"
              style={{ width: '100%', padding: '14px', fontSize: '16px' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '28px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--color-eclipse-violet)', fontWeight: 600 }}>
              Create an account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
