import React from 'react';
import TimelineItem from './TimelineItem';
import GapItem from './GapItem';
import { format12HourTime, formatDuration } from '../utils/formatters';

export default function Timeline({
  timeline,
  productivityWindow,
  onEdit,
  onDelete,
  onStop,
  onFillGap
}) {
  if (!timeline || timeline.length === 0) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-cards)',
        textAlign: 'center',
        padding: '60px 24px',
        boxShadow: 'var(--shadow-xl)'
      }}>
        <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>Your day is still unwritten</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Use the fast composer above to start your first stopwatch activity for today.
        </p>
      </div>
    );
  }

  const workStartStr = productivityWindow?.workStart || '09:00';
  const workEndStr = productivityWindow?.workEnd || '17:00';

  const [wSH, wSM] = workStartStr.split(':').map(Number);
  const [wEH, wEM] = workEndStr.split(':').map(Number);

  // Group timeline items into 3 zones: Pre-productivity, Productivity Window, Post-productivity
  const preItems = [];
  const focusItems = [];
  const postItems = [];

  timeline.forEach((item) => {
    let itemDate;
    if (item.type === 'activity') {
      itemDate = new Date(item.data.startTime);
    } else {
      itemDate = new Date(item.startTime);
    }

    const itemH = itemDate.getHours();
    const itemM = itemDate.getMinutes();
    const itemTimeVal = itemH * 60 + itemM;
    const windowStartVal = wSH * 60 + wSM;
    const windowEndVal = wEH * 60 + wEM;

    if (itemTimeVal < windowStartVal) {
      preItems.push(item);
    } else if (itemTimeVal >= windowStartVal && itemTimeVal < windowEndVal) {
      focusItems.push(item);
    } else {
      postItems.push(item);
    }
  });

  const renderZoneItems = (items) => {
    return items.map((item, idx) => {
      if (item.type === 'activity') {
        return (
          <TimelineItem
            key={item.data._id || idx}
            activity={item.data}
            onEdit={onEdit}
            onDelete={onDelete}
            onStop={onStop}
          />
        );
      } else if (item.type === 'gap') {
        return (
          <GapItem
            key={`gap-${idx}`}
            gap={item}
            onFillGap={onFillGap}
          />
        );
      }
      return null;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
      {/* Zone 1: Pre-Productivity Window */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span className="badge-kicker badge-lilac" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
            Before Productivity Window (Before {format12HourTime(workStartStr)})
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
        </div>

        {preItems.length === 0 ? (
          <div style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic' }}>
            No early morning activities logged before {format12HourTime(workStartStr)}.
          </div>
        ) : (
          <div className="timeline-list">{renderZoneItems(preItems)}</div>
        )}
      </div>

      {/* Zone 2: Core Productivity Hours Window */}
      <div style={{
        background: 'var(--color-productive-bg)',
        border: '2px solid var(--color-eclipse-violet)',
        borderRadius: 'var(--radius-cards)',
        padding: '28px 32px',
        boxShadow: 'var(--shadow-xl)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span className="badge-kicker badge-productive" style={{ marginBottom: '6px' }}>
              Core Productivity Hours ({format12HourTime(workStartStr)} – {format12HourTime(workEndStr)})
            </span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Focus Time Goal
            </h3>
          </div>

          {productivityWindow && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--color-eclipse-violet)' }}>
                {formatDuration(productivityWindow.windowProductiveSeconds)} Productive
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {productivityWindow.percentage}% of {formatDuration(productivityWindow.windowTotalSeconds)} work window
              </div>
            </div>
          )}
        </div>

        {focusItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
            No focus activities logged during your productivity window yet. Use the composer above to start a task!
          </div>
        ) : (
          <div className="timeline-list">{renderZoneItems(focusItems)}</div>
        )}
      </div>

      {/* Zone 3: Post-Productivity Window */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span className="badge-kicker badge-lilac" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
            After Productivity Window (After {format12HourTime(workEndStr)})
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
        </div>

        {postItems.length === 0 ? (
          <div style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic' }}>
            No evening/night activities logged after {format12HourTime(workEndStr)}.
          </div>
        ) : (
          <div className="timeline-list">{renderZoneItems(postItems)}</div>
        )}
      </div>
    </div>
  );
}
