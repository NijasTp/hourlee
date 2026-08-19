import React, { useState, useEffect } from 'react';
import { X, Zap, Coffee, Clock, AlertTriangle } from 'lucide-react';
import { toTimeString, parseDateTime, getTodayDateString } from '../utils/formatters';

export default function AddActivityModal({
  isOpen,
  onClose,
  onSubmit,
  initialStart,
  initialEnd,
  currentDateStr
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('productive');
  const [hasEndTime, setHasEndTime] = useState(false);
  const [startTimeStr, setStartTimeStr] = useState('');
  const [endTimeStr, setEndTimeStr] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [conflictData, setConflictData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setCategory('productive');
      setErrorMsg('');
      setConflictData(null);

      const now = new Date();
      if (initialStart) {
        setStartTimeStr(toTimeString(initialStart));
      } else {
        setStartTimeStr(toTimeString(now));
      }

      if (initialEnd) {
        setHasEndTime(true);
        setEndTimeStr(toTimeString(initialEnd));
      } else {
        setHasEndTime(false);
        setEndTimeStr(toTimeString(now));
      }
    }
  }, [isOpen, initialStart, initialEnd]);

  if (!isOpen) return null;

  const quickTitles = [
    { name: 'Coding', category: 'productive' },
    { name: 'Studying DSA', category: 'productive' },
    { name: 'Gym Workout', category: 'productive' },
    { name: 'Lunch Break', category: 'non-productive' },
    { name: 'YouTube & Chill', category: 'non-productive' },
    { name: 'Free Time', category: 'non-productive' }
  ];

  const handleQuickTitle = (item) => {
    setTitle(item.name);
    setCategory(item.category);
  };

  const handleSave = async (stopCurrentIfRunning = false) => {
    if (!title.trim()) {
      setErrorMsg('Please enter an activity title');
      return;
    }

    const dateBase = currentDateStr || getTodayDateString();
    const startDateObj = parseDateTime(dateBase, startTimeStr);
    const endDateObj = hasEndTime ? parseDateTime(dateBase, endTimeStr) : null;

    if (hasEndTime && endDateObj <= startDateObj) {
      setErrorMsg('End time must be after start time');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setConflictData(null);

    try {
      await onSubmit({
        title: title.trim(),
        category,
        startTime: startDateObj,
        endTime: endDateObj,
        stopCurrentIfRunning
      });
      onClose();
    } catch (err) {
      if (err.data && err.data.requiresConfirmation) {
        setConflictData(err.data);
      } else if (err.data && err.data.isOverlap) {
        setErrorMsg(err.data.message);
      } else {
        setErrorMsg(err.message || 'Failed to create activity');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <span className="badge-kicker badge-lilac" style={{ marginBottom: '6px' }}>Time Entry</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800 }}>Log Past Activity</h3>
          </div>
          <button onClick={onClose} className="btn-pill-ghost" style={{ padding: '8px' }}>
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid rgba(225, 29, 72, 0.25)', color: '#e11d48', padding: '12px 16px', borderRadius: '16px', fontSize: '14px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Running Activity Conflict Prompt */}
        {conflictData && (
          <div style={{ background: 'var(--color-productive-bg)', border: '1px solid var(--color-eclipse-violet)', padding: '20px', borderRadius: '24px', marginBottom: '24px' }}>
            <p style={{ fontWeight: 600, fontSize: '14px', marginBottom: '14px', color: 'var(--text-primary)' }}>
              {conflictData.message}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleSave(true)}
                className="btn-pill btn-pill-violet"
                style={{ padding: '10px 18px', fontSize: '13px' }}
              >
                End Current & Start This
              </button>
              <button
                onClick={() => setConflictData(null)}
                className="btn-pill btn-pill-ghost"
                style={{ padding: '10px 14px', fontSize: '13px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div style={{ marginBottom: '20px' }}>
          <span className="form-label">Quick Suggestions</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {quickTitles.map((qt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickTitle(qt)}
                className="chip-tag"
              >
                {qt.name}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Activity Title</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Coding, Reading, Lunch"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <div className="category-selector">
            <button
              type="button"
              className={`category-btn ${category === 'productive' ? 'selected-productive' : ''}`}
              onClick={() => setCategory('productive')}
            >
              <Zap size={16} />
              <span>Productive</span>
            </button>
            <button
              type="button"
              className={`category-btn ${category === 'non-productive' ? 'selected-non-productive' : ''}`}
              onClick={() => setCategory('non-productive')}
            >
              <Coffee size={16} />
              <span>Non-productive</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }} className="form-group">
          <div>
            <label className="form-label">Start Time</label>
            <input
              type="time"
              className="form-input"
              value={startTimeStr}
              onChange={(e) => setStartTimeStr(e.target.value)}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="form-label">End Time</label>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input
                  type="checkbox"
                  checked={!hasEndTime}
                  onChange={(e) => setHasEndTime(!e.target.checked)}
                />
                <span>Running now</span>
              </label>
            </div>
            {hasEndTime ? (
              <input
                type="time"
                className="form-input"
                value={endTimeStr}
                onChange={(e) => setEndTimeStr(e.target.value)}
              />
            ) : (
              <div className="form-input" style={{ opacity: 0.7, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                <Clock size={14} />
                <span>Timer active until stopped</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
          <button type="button" onClick={onClose} className="btn-pill btn-pill-ghost">
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSave(false)}
            className="btn-pill btn-pill-violet"
          >
            {hasEndTime ? 'Save Activity' : 'Start Timer'}
          </button>
        </div>
      </div>
    </div>
  );
}
