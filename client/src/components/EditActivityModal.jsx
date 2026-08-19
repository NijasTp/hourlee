import React, { useState, useEffect } from 'react';
import { X, Zap, Coffee, AlertTriangle } from 'lucide-react';
import { toTimeString, parseDateTime, getTodayDateString } from '../utils/formatters';

export default function EditActivityModal({
  isOpen,
  onClose,
  onSubmit,
  activity,
  currentDateStr
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('productive');
  const [startTimeStr, setStartTimeStr] = useState('');
  const [endTimeStr, setEndTimeStr] = useState('');
  const [hasEndTime, setHasEndTime] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && activity) {
      setTitle(activity.title || '');
      setCategory(activity.category || 'productive');
      setErrorMsg('');

      if (activity.startTime) {
        setStartTimeStr(toTimeString(activity.startTime));
      }
      if (activity.endTime) {
        setHasEndTime(true);
        setEndTimeStr(toTimeString(activity.endTime));
      } else {
        setHasEndTime(false);
        setEndTimeStr(toTimeString(new Date()));
      }
    }
  }, [isOpen, activity]);

  if (!isOpen || !activity) return null;

  const handleUpdate = async () => {
    if (!title.trim()) {
      setErrorMsg('Title cannot be empty');
      return;
    }

    const dateBase = currentDateStr || getTodayDateString(new Date(activity.startTime));
    const startDateObj = parseDateTime(dateBase, startTimeStr);
    const endDateObj = hasEndTime ? parseDateTime(dateBase, endTimeStr) : null;

    if (hasEndTime && endDateObj <= startDateObj) {
      setErrorMsg('End time must be after start time');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await onSubmit(activity._id, {
        title: title.trim(),
        category,
        startTime: startDateObj,
        endTime: endDateObj,
        isRunning: !hasEndTime
      });
      onClose();
    } catch (err) {
      if (err.data && err.data.isOverlap) {
        setErrorMsg(err.data.message);
      } else {
        setErrorMsg(err.message || 'Failed to update activity');
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
            <span className="badge-kicker badge-lilac" style={{ marginBottom: '6px' }}>Edit Activity</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800 }}>Update Time Entry</h3>
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

        <div className="form-group">
          <label className="form-label">Activity Title</label>
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
                <span>Running</span>
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
              <div className="form-input" style={{ opacity: 0.7, fontSize: '13px' }}>
                Active running timer
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
            onClick={handleUpdate}
            className="btn-pill btn-pill-violet"
          >
            Update Activity
          </button>
        </div>
      </div>
    </div>
  );
}
