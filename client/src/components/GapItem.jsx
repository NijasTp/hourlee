import React from 'react';
import { formatTime, formatDuration } from '../utils/formatters';

export default function GapItem({ gap, onFillGap }) {
  const startTimeFormatted = formatTime(gap.startTime);
  const endTimeFormatted = formatTime(gap.endTime);

  return (
    <div className="timeline-gap-slot">
      <div className="timeline-time-label">{startTimeFormatted}</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Unlogged</span>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
          {startTimeFormatted} – {endTimeFormatted} ({formatDuration(gap.duration)})
        </span>
      </div>

      <button
        onClick={() => onFillGap(gap.startTime, gap.endTime)}
        className="btn-pill btn-pill-quiet"
        style={{ padding: '6px 14px', fontSize: '13px' }}
      >
        + Fill gap
      </button>
    </div>
  );
}
