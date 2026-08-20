import React from 'react';
import { formatDateReadable, getTodayDateString } from '../utils/formatters';

export default function DateNavigator({ currentDateStr, onDateChange }) {
  const todayStr = getTodayDateString();
  const isToday = currentDateStr === todayStr;

  const handlePrevDay = () => {
    const [year, month, day] = currentDateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    d.setDate(d.getDate() - 1);
    onDateChange(getTodayDateString(d));
  };

  const handleNextDay = () => {
    const [year, month, day] = currentDateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    d.setDate(d.getDate() + 1);
    onDateChange(getTodayDateString(d));
  };

  const handleToday = () => {
    onDateChange(todayStr);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge-kicker badge-lilac">Daily Timeline</span>
            {isToday && <span className="badge-kicker badge-productive">Today</span>}
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            {formatDateReadable(currentDateStr)}
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', width: '100%', maxWidth: '420px' }}>
          <button onClick={handlePrevDay} className="btn-pill btn-pill-quiet" style={{ flex: 1, padding: '8px 12px', fontSize: '12px' }}>
            ← Prev
          </button>

          {!isToday && (
            <button onClick={handleToday} className="btn-pill btn-pill-quiet" style={{ flex: 1, padding: '8px 12px', fontSize: '12px' }}>
              Today
            </button>
          )}

          <button onClick={handleNextDay} className="btn-pill btn-pill-quiet" style={{ flex: 1, padding: '8px 12px', fontSize: '12px' }}>
            Next →
          </button>

          <input
            type="date"
            value={currentDateStr}
            onChange={(e) => e.target.value && onDateChange(e.target.value)}
            className="input-pill"
            style={{ padding: '6px 12px', fontSize: '12px', width: 'auto', flex: 1 }}
          />
        </div>
      </div>
    </div>
  );
}
