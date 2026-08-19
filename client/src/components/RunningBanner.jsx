import React from 'react';
import { Square, Play, Sparkles } from 'lucide-react';
import { useTimer } from '../context/TimerContext';
import { formatTimerDigits, formatTime } from '../utils/formatters';

export default function RunningBanner({ onStopComplete }) {
  const { runningActivity, elapsedSeconds, stopTimer } = useTimer();

  if (!runningActivity) return null;

  const handleStop = async () => {
    try {
      await stopTimer();
      if (onStopComplete) onStopComplete();
    } catch (err) {
      console.error('Error stopping timer', err);
    }
  };

  const isProductive = runningActivity.category === 'productive';

  return (
    <div className="running-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div className="pulse-dot" />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span className={`badge-pill ${isProductive ? 'badge-productive' : 'badge-non-productive'}`}>
              {isProductive ? 'Productive' : 'Non-productive'}
            </span>
            <span className="badge-pill badge-running">● Running</span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Started at {formatTime(runningActivity.startTime)}
            </span>
          </div>

          <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {runningActivity.title}
          </h3>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div className="timer-digits">
          {formatTimerDigits(elapsedSeconds)}
        </div>

        <button onClick={handleStop} className="btn-pill btn-pill-dark" style={{ padding: '12px 24px', background: '#e11d48', color: '#ffffff' }}>
          <Square size={16} fill="currentColor" />
          <span>Stop Timer</span>
        </button>
      </div>
    </div>
  );
}
