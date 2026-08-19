import React, { useState } from 'react';
import { format12HourTime } from '../utils/formatters';

export default function ProductivityWindowPrompt({ onSaveWindow }) {
  const [workStart, setWorkStart] = useState('09:00');
  const [workEnd, setWorkEnd] = useState('17:00');

  const handleQuick9to5 = () => {
    onSaveWindow('09:00', '17:00');
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    onSaveWindow(workStart, workEnd);
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '2px solid var(--color-eclipse-violet)',
      borderRadius: 'var(--radius-cards)',
      padding: '32px 36px',
      marginBottom: '36px',
      boxShadow: 'var(--shadow-xl)'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <span className="badge-kicker badge-lilac" style={{ marginBottom: '8px' }}>
          Daily Setup Required
        </span>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, letterSpacing: '-0.03em' }}>
          Set Your Productivity Hours for Today
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '6px', maxWidth: '680px' }}>
          Specify your core focus hours (e.g. 9:00 AM to 5:00 PM). Hourlee will structure your daily timeline around this window and measure focus time. You can log tasks before, during, or after this window.
        </p>
      </div>

      <form onSubmit={handleCustomSubmit} style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>From:</span>
          <input
            type="time"
            value={workStart}
            onChange={(e) => setWorkStart(e.target.value)}
            className="input-pill"
            style={{ padding: '8px 16px', fontSize: '14px', width: 'auto' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>To:</span>
          <input
            type="time"
            value={workEnd}
            onChange={(e) => setWorkEnd(e.target.value)}
            className="input-pill"
            style={{ padding: '8px 16px', fontSize: '14px', width: 'auto' }}
          />
        </div>

        <button type="button" onClick={handleQuick9to5} className="btn-pill btn-pill-violet">
          Set 9:00 AM – 5:00 PM (Default)
        </button>

        <button type="submit" className="btn-pill btn-pill-dark">
          Confirm {format12HourTime(workStart)} – {format12HourTime(workEnd)}
        </button>
      </form>
    </div>
  );
}
