import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { user, logout, addSuggestion, removeSuggestion } = useAuth();
  const { theme, setTheme } = useTheme();

  const [newSuggestion, setNewSuggestion] = useState('');
  const [suggestionError, setSuggestionError] = useState('');
  const [seedSuccess, setSeedSuccess] = useState(false);
  const [loadingSeed, setLoadingSeed] = useState(false);

  const handleAddSuggestion = async (e) => {
    e.preventDefault();
    if (!newSuggestion.trim()) {
      setSuggestionError('Please enter a suggestion name');
      return;
    }
    setSuggestionError('');
    try {
      await addSuggestion(newSuggestion.trim());
      setNewSuggestion('');
    } catch (err) {
      setSuggestionError(err.message || 'Failed to add suggestion');
    }
  };

  const handleRemoveSuggestion = async (text) => {
    try {
      await removeSuggestion(text);
    } catch (err) {
      console.error('Failed to remove suggestion', err);
    }
  };

  const handleSeedData = async () => {
    setLoadingSeed(true);
    setSeedSuccess(false);
    try {
      const today = new Date();
      const createDateAt = (dayOffset, hours, minutes) => {
        const d = new Date(today);
        d.setDate(d.getDate() - dayOffset);
        d.setHours(hours, minutes, 0, 0);
        return d;
      };

      const sampleActs = [
        { title: 'Coding Hourlee Application', category: 'productive', startTime: createDateAt(0, 9, 0), endTime: createDateAt(0, 11, 30) },
        { title: 'Lunch & Break', category: 'non-productive', startTime: createDateAt(0, 12, 0), endTime: createDateAt(0, 13, 0) },
        { title: 'Studying DSA & System Design', category: 'productive', startTime: createDateAt(0, 13, 30), endTime: createDateAt(0, 16, 0) },
        { title: 'Gym Workout', category: 'productive', startTime: createDateAt(0, 17, 0), endTime: createDateAt(0, 18, 30) }
      ];

      const token = localStorage.getItem('hourlee_token');
      for (const act of sampleActs) {
        await fetch('/api/activities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(act)
        });
      }

      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 4000);
    } catch (err) {
      console.error('Seed error', err);
    } finally {
      setLoadingSeed(false);
    }
  };

  const currentSuggestions = user?.suggestions || [];

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-wrap">
        <div style={{ marginBottom: '40px' }}>
          <span className="badge-kicker badge-lilac" style={{ marginBottom: '12px' }}>
            Product Preferences
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            Settings
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '8px' }}>
            Manage task suggestions, theme appearance, and account information.
          </p>
        </div>

        {/* 1. Quick Task Suggestions Section */}
        <div className="settings-block">
          <div className="settings-header">
            <span className="badge-kicker badge-lilac" style={{ marginBottom: '8px' }}>
              Customizations
            </span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700 }}>
              Quick Task Suggestions
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
              Manage quick suggestion tags displayed on your task composer.
            </p>
          </div>

          <form onSubmit={handleAddSuggestion} style={{ display: 'flex', gap: '12px', marginBottom: '24px', maxWidth: '520px' }}>
            <input
              type="text"
              className="input-pill"
              placeholder="Add new suggestion (e.g. Reading, Walking)"
              value={newSuggestion}
              onChange={(e) => setNewSuggestion(e.target.value)}
            />
            <button type="submit" className="btn-pill btn-pill-violet" style={{ whiteSpace: 'nowrap' }}>
              Add Tag
            </button>
          </form>

          {suggestionError && (
            <div style={{ color: '#e11d48', fontSize: '14px', marginBottom: '16px' }}>
              {suggestionError}
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {currentSuggestions.length === 0 ? (
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>No custom suggestions added yet.</span>
            ) : (
              currentSuggestions.map((sug, idx) => (
                <div key={idx} className="chip-tag" style={{ padding: '8px 18px', fontSize: '14px' }}>
                  <span>{sug}</span>
                  <button
                    type="button"
                    className="chip-del"
                    onClick={() => handleRemoveSuggestion(sug)}
                    title="Remove suggestion"
                    style={{ marginLeft: '6px', fontSize: '16px' }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. Appearance Theme Section */}
        <div className="settings-block">
          <div className="settings-header">
            <span className="badge-kicker badge-lilac" style={{ marginBottom: '8px' }}>
              Visual Identity
            </span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700 }}>
              Appearance Theme
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
              Switch between studio off-white light mode and deep ink dark mode.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '420px' }}>
            <button
              onClick={() => setTheme('light')}
              className={`btn-pill ${theme === 'light' ? 'btn-pill-dark' : 'btn-pill-quiet'}`}
              style={{ padding: '16px' }}
            >
              Light Mode
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`btn-pill ${theme === 'dark' ? 'btn-pill-dark' : 'btn-pill-quiet'}`}
              style={{ padding: '16px' }}
            >
              Dark Mode
            </button>
          </div>
        </div>

        {/* 3. Account Profile Section */}
        <div className="settings-block">
          <div className="settings-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span className="badge-kicker badge-lilac" style={{ marginBottom: '8px' }}>
                Account
              </span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700 }}>
                Profile Overview
              </h3>
            </div>
            <button onClick={logout} className="btn-pill btn-pill-quiet" style={{ color: '#e11d48', padding: '10px 20px', fontSize: '13px' }}>
              Log Out
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Username</span>
              <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>{user?.username}</p>
            </div>

            <div>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Email Address</span>
              <p style={{ fontSize: '16px', color: 'var(--text-primary)', marginTop: '4px' }}>{user?.email}</p>
            </div>

            <div>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Member Since</span>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
              </p>
            </div>
          </div>
        </div>

        {/* 4. Development Seed Section */}
        <div className="settings-block">
          <div className="settings-header">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700 }}>
              Development Seed Data
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
              Populate realistic sample activities into your account.
            </p>
          </div>

          {seedSuccess && (
            <div style={{ color: '#10b981', fontSize: '14px', marginBottom: '16px', fontWeight: 600 }}>
              Sample activities seeded successfully!
            </div>
          )}

          <button
            onClick={handleSeedData}
            disabled={loadingSeed}
            className="btn-pill btn-pill-quiet"
          >
            {loadingSeed ? 'Seeding...' : 'Seed Sample Activities'}
          </button>
        </div>
      </main>
    </div>
  );
}
