import React, { useState } from 'react';
import { formatTime, formatDuration } from '../utils/formatters';

export default function TimelineItem({ activity, onEdit, onDelete, onStop }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isProductive = activity.category === 'productive';
  const startTimeFormatted = formatTime(activity.startTime);

  let endTimeFormatted = 'Until next task';
  if (activity.endTime) {
    endTimeFormatted = formatTime(activity.endTime);
  } else if (activity.effectiveEndTime) {
    endTimeFormatted = formatTime(activity.effectiveEndTime);
  }

  let durationInSeconds = activity.duration;
  if (!activity.endTime && activity.startTime) {
    durationInSeconds = Math.max(0, Math.floor((Date.now() - new Date(activity.startTime).getTime()) / 1000));
  }

  return (
    <div className="timeline-row">
      <div className="timeline-time-label">{startTimeFormatted}</div>
      <div className="timeline-bullet" style={{ background: isProductive ? 'var(--color-violet)' : 'var(--color-slate-light)' }} />

      <div style={{ flex: 1, paddingRight: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className={`tag-cat ${isProductive ? 'tag-productive' : 'tag-non-productive'}`}>
            {isProductive ? 'Productive' : 'Non-productive'}
          </span>

          {activity.isRunning && (
            <span className="tag-cat" style={{ background: 'rgba(0, 178, 255, 0.12)', color: '#00b2ff' }}>
              ● Stopwatch Active
            </span>
          )}

          <span style={{ fontSize: '13px', color: 'var(--text-sub)' }}>
            {startTimeFormatted} – {endTimeFormatted}
          </span>
        </div>

        <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-main)' }}>
          {activity.title}
        </h4>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
          {formatDuration(durationInSeconds)}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => onEdit(activity)}
            className="btn-action btn-action-quiet"
            style={{ padding: '4px 10px', fontSize: '12px' }}
          >
            Edit
          </button>

          {confirmDelete ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => onDelete(activity._id)}
                className="btn-action"
                style={{ padding: '4px 10px', fontSize: '12px', background: '#e11d48', color: '#fff' }}
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="btn-action btn-action-quiet"
                style={{ padding: '4px 8px', fontSize: '12px' }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="btn-action btn-action-quiet"
              style={{ padding: '4px 10px', fontSize: '12px', color: 'var(--text-muted)' }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
