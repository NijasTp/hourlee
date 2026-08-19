import React from 'react';
import { Clock, Zap, Coffee, AlertCircle } from 'lucide-react';
import { formatDuration } from '../utils/formatters';

export default function DailySummaryBar({ summary }) {
  if (!summary) return null;

  return (
    <div className="summary-grid">
      <div className="summary-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="summary-card-lbl">Total Tracked</span>
          <Clock size={18} style={{ color: 'var(--color-eclipse-violet)' }} />
        </div>
        <div className="summary-card-val">{formatDuration(summary.totalTrackedSeconds)}</div>
      </div>

      <div className="summary-card" style={{ borderColor: 'var(--color-productive-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="summary-card-lbl" style={{ color: 'var(--color-productive-text)' }}>Productive</span>
          <Zap size={18} style={{ color: 'var(--color-productive-text)' }} />
        </div>
        <div className="summary-card-val" style={{ color: 'var(--color-productive-text)' }}>
          {formatDuration(summary.productiveSeconds)}
        </div>
      </div>

      <div className="summary-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="summary-card-lbl">Non-productive</span>
          <Coffee size={18} style={{ color: 'var(--text-secondary)' }} />
        </div>
        <div className="summary-card-val">{formatDuration(summary.nonProductiveSeconds)}</div>
      </div>

      <div className="summary-card" style={{ background: 'var(--bg-canvas)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="summary-card-lbl">Unlogged Time</span>
          <AlertCircle size={18} style={{ color: 'var(--text-muted)' }} />
        </div>
        <div className="summary-card-val" style={{ color: 'var(--text-muted)' }}>
          {formatDuration(summary.unloggedSeconds)}
        </div>
      </div>
    </div>
  );
}
