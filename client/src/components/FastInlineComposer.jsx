import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function FastInlineComposer({ onStartStopwatch, onOpenPastModal }) {
  const { user, removeSuggestion } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('productive');

  const suggestions = user?.suggestions || [
    'Talking',
    'Coding',
    'Studying DSA',
    'Gym Workout',
    'Lunch',
    'YouTube',
    'Free Time'
  ];

  const handlePickSuggestion = (name) => {
    setTitle(name);
    if (['Lunch', 'Talking', 'YouTube', 'Free Time'].includes(name)) {
      setCategory('non-productive');
    } else {
      setCategory('productive');
    }
  };

  const handleRemoveSuggestionChip = async (e, sugName) => {
    e.stopPropagation();
    try {
      await removeSuggestion(sugName);
    } catch (err) {
      console.error('Failed to remove suggestion', err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onStartStopwatch({
      title: title.trim(),
      category,
      startTime: new Date()
    });
    setTitle('');
  };

  return (
    <div className="composer-card">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <span className="badge-kicker badge-lilac">Task Composer</span>
          <button
            type="button"
            onClick={onOpenPastModal}
            style={{ fontSize: '13px', color: 'var(--color-eclipse-violet)', fontWeight: 600, textDecoration: 'underline' }}
          >
            + Add past activity with custom time
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="input-pill"
            style={{ flex: 1, minWidth: '260px' }}
            placeholder="What are you doing right now? (e.g. Talking, Coding, Lunch)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              className={`badge-kicker ${category === 'productive' ? 'badge-productive' : ''}`}
              style={{ cursor: 'pointer', padding: '12px 18px', fontSize: '13px', borderRadius: '40px' }}
              onClick={() => setCategory('productive')}
            >
              Productive
            </button>
            <button
              type="button"
              className={`badge-kicker ${category === 'non-productive' ? 'badge-non-productive' : ''}`}
              style={{ cursor: 'pointer', padding: '12px 18px', fontSize: '13px', borderRadius: '40px' }}
              onClick={() => setCategory('non-productive')}
            >
              Non-productive
            </button>
          </div>

          <button type="submit" className="btn-pill btn-pill-violet">
            Start Stopwatch
          </button>
        </div>

        {/* Suggestion Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '4px' }}>
          {suggestions.map((sug, idx) => (
            <div
              key={idx}
              className="chip-tag"
              onClick={() => handlePickSuggestion(sug)}
            >
              <span>{sug}</span>
              <button
                type="button"
                className="chip-del"
                onClick={(e) => handleRemoveSuggestionChip(e, sug)}
                title="Remove suggestion"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}
