import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { activityAPI } from '../services/api';
import { formatDateReadable, formatDuration } from '../utils/formatters';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await activityAPI.getHistory();
        setHistory(data.history || []);
      } catch (err) {
        console.error('Failed to load history', err);
        setError(err.message || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleSelectDay = (dateStr) => {
    navigate(`/today?date=${dateStr}`);
  };

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-wrap">
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800 }}>History</h2>
          <p style={{ color: 'var(--text-sub)', fontSize: '15px' }}>
            Browse your past days and inspect timeline logs.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-sub)' }}>
            Loading history...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: '#e11d48' }}>
            {error}
          </div>
        ) : history.length === 0 ? (
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '24px',
            textAlign: 'center',
            padding: '60px 24px'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>No history records yet</h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '14px' }}>
              Start logging activities today to build your history.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {history.map((day) => (
              <div
                key={day.date}
                onClick={() => handleSelectDay(day.date)}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  padding: '20px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                    {formatDateReadable(day.date)}
                  </h3>
                  <span style={{ fontSize: '13px', color: 'var(--text-sub)' }}>
                    {day.activityCount} {day.activityCount === 1 ? 'activity' : 'activities'} logged
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '14px', color: 'var(--color-productive-text)', fontWeight: 600 }}>
                    Productive: {formatDuration(day.productiveSeconds)}
                  </div>

                  <div style={{ fontSize: '14px', color: 'var(--text-sub)', fontWeight: 600 }}>
                    Non-productive: {formatDuration(day.nonProductiveSeconds)}
                  </div>

                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                    Total: {formatDuration(day.totalTrackedSeconds)}
                  </div>

                  <button className="btn-action btn-action-quiet" style={{ padding: '6px 12px', fontSize: '12px' }}>
                    Inspect Day
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
