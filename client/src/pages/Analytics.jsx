import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { analyticsAPI } from '../services/api';
import { formatDuration } from '../utils/formatters';

export default function Analytics() {
  const [range, setRange] = useState('today');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await analyticsAPI.getAnalytics(range);
        setStats(data.stats);
      } catch (err) {
        console.error('Failed to load analytics', err);
        setError(err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [range]);

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-wrap">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800 }}>Analytics</h2>
            <p style={{ color: 'var(--text-sub)', fontSize: '15px' }}>
              Productivity metrics and time allocation.
            </p>
          </div>

          <div className="nav-row">
            <button
              onClick={() => setRange('today')}
              className={`nav-link ${range === 'today' ? 'active' : ''}`}
            >
              Today
            </button>
            <button
              onClick={() => setRange('week')}
              className={`nav-link ${range === 'week' ? 'active' : ''}`}
            >
              This Week
            </button>
            <button
              onClick={() => setRange('month')}
              className={`nav-link ${range === 'month' ? 'active' : ''}`}
            >
              This Month
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-sub)' }}>
            Loading analytics...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: '#e11d48' }}>
            {error}
          </div>
        ) : !stats ? null : (
          <div>
            {/* Visual Split Bar */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '24px',
              padding: '28px',
              marginBottom: '32px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Productive vs Non-Productive Ratio</h3>

              <div style={{ height: '20px', borderRadius: '10px', overflow: 'hidden', background: 'var(--bg-input)', display: 'flex', marginBottom: '16px' }}>
                <div
                  style={{
                    width: `${stats.productivePercentage}%`,
                    background: 'var(--color-violet)',
                    transition: 'width 0.4s ease'
                  }}
                />
                <div
                  style={{
                    width: `${stats.nonProductivePercentage}%`,
                    background: 'var(--color-slate-light)',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600 }}>
                <span style={{ color: 'var(--color-productive-text)' }}>
                  Productive: {stats.productivePercentage}% ({formatDuration(stats.productiveSeconds)})
                </span>
                <span style={{ color: 'var(--text-sub)' }}>
                  Non-productive: {stats.nonProductivePercentage}% ({formatDuration(stats.nonProductiveSeconds)})
                </span>
              </div>
            </div>

            {/* Clean Stats Breakdown List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '20px 24px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-sub)', fontWeight: 500 }}>Total Tracked</span>
                <div style={{ fontSize: '28px', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                  {formatDuration(stats.totalTrackedSeconds)}
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '20px 24px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-sub)', fontWeight: 500 }}>Avg Productive / Day</span>
                <div style={{ fontSize: '28px', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--color-productive-text)', marginTop: '4px' }}>
                  {formatDuration(stats.averageProductivePerDaySeconds)}
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '20px 24px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-sub)', fontWeight: 500 }}>Activities Logged</span>
                <div style={{ fontSize: '28px', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                  {stats.activityCount}
                </div>
              </div>
            </div>

            {/* Top Activities */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '28px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Top Activities</h3>

              {stats.topActivities.length === 0 ? (
                <p style={{ color: 'var(--text-sub)', fontSize: '14px' }}>No activities logged in this range.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {stats.topActivities.map((act, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className={`tag-cat ${act.category === 'productive' ? 'tag-productive' : 'tag-non-productive'}`}>
                          {act.category === 'productive' ? 'Productive' : 'Non-productive'}
                        </span>
                        <span style={{ fontWeight: 600, fontSize: '15px' }}>{act.title}</span>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 700 }}>
                        {formatDuration(act.totalDuration)} ({act.count} logs)
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
