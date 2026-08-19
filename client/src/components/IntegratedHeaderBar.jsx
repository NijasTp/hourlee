import React from 'react';
import { formatDuration, format12HourTime } from '../utils/formatters';

export default function IntegratedHeaderBar({ summary, productivityWindow }) {
  if (!summary) return null;

  return (
    <div className="timeline-header-bar">
      {productivityWindow ? (
        <div className="stat-inline" style={{ color: 'var(--color-productive-text)' }}>
          <span>Productivity Hours ({format12HourTime(productivityWindow.workStart)} – {format12HourTime(productivityWindow.workEnd)}):</span>
          <span>{formatDuration(productivityWindow.windowProductiveSeconds)} productive ({productivityWindow.percentage}%)</span>
        </div>
      ) : (
        <div className="stat-inline">
          <span>Day Overview:</span>
          <span>{summary.activityCount} tasks logged</span>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: 'var(--text-sub)' }}>
        <div>
          <strong style={{ color: 'var(--text-main)' }}>Tracked:</strong> {formatDuration(summary.totalTrackedSeconds)}
        </div>
        <div>
          <strong style={{ color: 'var(--color-productive-text)' }}>Prod:</strong> {formatDuration(summary.productiveSeconds)}
        </div>
        <div>
          <strong>Non-prod:</strong> {formatDuration(summary.nonProductiveSeconds)}
        </div>
        <div>
          <strong style={{ color: 'var(--text-muted)' }}>Unlogged:</strong> {formatDuration(summary.unloggedSeconds)}
        </div>
      </div>
    </div>
  );
}
