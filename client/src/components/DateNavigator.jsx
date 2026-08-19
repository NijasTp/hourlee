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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <span className="badge-kicker badge-lilac">Daily Timeline</span>
          {isToday && <span className="badge-kicker badge-productive">Today</span>}
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
          {formatDateReadable(currentDateStr)}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={handlePrevDay} className="btn-pill btn-pill-quiet" style={{ padding: '8px 18px', fontSize: '13px' }}>
          ← Prev Day
        </button>

        {!isToday && (
          <button onClick={handleToday} className="btn-pill btn-pill-quiet" style={{ padding: '8px 18px', fontSize: '13px' }}>
            Today
          </button>
        )}

        <button onClick={handleNextDay} className="btn-pill btn-pill-quiet" style={{ padding: '8px 18px', fontSize: '13px' }}>
          Next Day →
        </button>

        <input
          type="date"
          value={currentDateStr}
          onChange={(e) => e.target.value && onDateChange(e.target.value)}
          className="input-pill"
          style={{ padding: '6px 14px', fontSize: '13px', width: 'auto', cursor: 'pointer' }}
        />
      </div>
    </div>
  );
}
