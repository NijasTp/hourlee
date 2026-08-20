import React, { useState, useEffect } from 'react';
import { formatTimerDigits, formatTime } from '../utils/formatters';

export default function StopwatchTicker({ runningActivity, onStop, onToggleCategory, onSwitchToNewCategory }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!runningActivity || !runningActivity.startTime) {
      setElapsedSeconds(0);
      return;
    }

    const calc = () => {
      const startMs = new Date(runningActivity.startTime).getTime();
      const nowMs = Date.now();
      setElapsedSeconds(Math.max(0, Math.floor((nowMs - startMs) / 1000)));
    };

    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [runningActivity?._id, runningActivity?.startTime]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        if (runningActivity) {
          const nextCategory = runningActivity.category === 'productive' ? 'non-productive' : 'productive';
          onToggleCategory(runningActivity._id, nextCategory);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [runningActivity, onToggleCategory]);

  if (!runningActivity) return null;

  const isProd = runningActivity.category === 'productive';

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `2px solid ${isProd ? 'var(--color-eclipse-violet)' : 'var(--color-slate)'}`,
      borderRadius: 'var(--radius-cards)',
      padding: '20px 24px',
      marginBottom: '28px',
      boxShadow: 'var(--shadow-xl)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '220px' }}>
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: isProd ? 'var(--color-eclipse-violet)' : 'var(--color-slate)',
          boxShadow: `0 0 10px ${isProd ? 'var(--color-eclipse-violet)' : 'var(--color-slate)'}`
        }} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <button
              type="button"
              onClick={() => onToggleCategory(runningActivity._id, isProd ? 'non-productive' : 'productive')}
              className={`badge-kicker ${isProd ? 'badge-productive' : 'badge-non-productive'}`}
              style={{ cursor: 'pointer' }}
              title="Click to toggle category (Alt+S)"
            >
              {isProd ? 'Productive' : 'Non-productive'} ⇄
            </button>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {formatTime(runningActivity.startTime)}
            </span>
          </div>
          <h3 style={{ fontSize: 'clamp(18px, 4.5vw, 24px)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {runningActivity.title}
          </h3>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', width: '100%', maxWidth: '420px', justifyContent: 'flex-end' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(28px, 6vw, 38px)',
          fontWeight: 800,
          letterSpacing: '-0.04em',
          color: 'var(--text-primary)',
          marginRight: 'auto'
        }}>
          {formatTimerDigits(elapsedSeconds)}
        </div>

        <button
          onClick={() => onToggleCategory(runningActivity._id, isProd ? 'non-productive' : 'productive')}
          className="btn-pill btn-pill-quiet"
          style={{ padding: '8px 14px', fontSize: '12px' }}
        >
          {isProd ? 'Mark Non-Productive' : 'Mark Productive'}
        </button>

        <button
          onClick={() => onSwitchToNewCategory(isProd ? 'non-productive' : 'productive')}
          className={isProd ? 'btn-pill btn-pill-quiet' : 'btn-pill btn-pill-violet'}
          style={{ padding: '8px 14px', fontSize: '12px' }}
        >
          {isProd ? '⚡ Unproductive Break' : '⚡ Productive Focus'}
        </button>

        <button
          onClick={() => onStop(runningActivity._id)}
          className="btn-pill btn-pill-dark"
          style={{ background: '#e11d48', color: '#ffffff', padding: '8px 16px', fontSize: '12px' }}
        >
          Stop
        </button>
      </div>
    </div>
  );
}
