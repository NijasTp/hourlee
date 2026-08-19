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

  // Keyboard shortcut: Alt + S toggles current activity's category
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
      padding: '24px 36px',
      marginBottom: '32px',
      boxShadow: 'var(--shadow-xl)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '20px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: isProd ? 'var(--color-eclipse-violet)' : 'var(--color-slate)',
          boxShadow: `0 0 12px ${isProd ? 'var(--color-eclipse-violet)' : 'var(--color-slate)'}`
        }} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <button
              type="button"
              onClick={() => onToggleCategory(runningActivity._id, isProd ? 'non-productive' : 'productive')}
              className={`badge-kicker ${isProd ? 'badge-productive' : 'badge-non-productive'}`}
              style={{ cursor: 'pointer' }}
              title="Click to toggle category (Alt+S)"
            >
              {isProd ? 'Productive' : 'Non-productive'} ⇄
            </button>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Started at {formatTime(runningActivity.startTime)}
            </span>
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {runningActivity.title}
          </h3>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '38px',
          fontWeight: 800,
          letterSpacing: '-0.04em',
          color: 'var(--text-primary)',
          marginRight: '8px'
        }}>
          {formatTimerDigits(elapsedSeconds)}
        </div>

       

        {/* 2. End Current Task & Start New Stopwatch starting NOW */}
        <button
          onClick={() => onSwitchToNewCategory(isProd ? 'non-productive' : 'productive')}
          className={isProd ? 'btn-pill btn-pill-quiet' : 'btn-pill btn-pill-violet'}
          style={{ padding: '10px 18px', fontSize: '13px' }}
          title="End this task and start a new stopwatch now"
        >
          {isProd ? '⚡ Start Unproductive Break' : '⚡ Start Productive Focus'}
        </button>

        <button
          onClick={() => onStop(runningActivity._id)}
          className="btn-pill btn-pill-dark"
          style={{ background: '#e11d48', color: '#ffffff', padding: '10px 18px', fontSize: '13px' }}
        >
          Stop
        </button>
      </div>
    </div>
  );
}
