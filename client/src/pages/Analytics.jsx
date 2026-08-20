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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span className="badge-kicker badge-lilac" style={{ marginBottom: '4px' }}>Productivity Insights</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 800, letterSpacing: '-0.03em' }}>Analytics</h1>
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
          <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-secondary)' }}>
            Loading analytics...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: '#e11d48' }}>
            {error}
          </div>
        ) : !stats ? null : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Productive vs Non-Productive Split Bar Card */}
            <div className="card-jitter" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px' }}>Productive vs Non-Productive Ratio</h3>

              <div style={{ height: '16px', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-input)', display: 'flex', marginBottom: '14px' }}>
                <div
                  style={{
                    width: `${stats.productivePercentage}%`,
                    background: 'var(--color-eclipse-violet)',
                    transition: 'width 0.4s ease'
                  }}
                />
                <div
                  style={{
                    width: `${stats.nonProductivePercentage}%`,
                    background: 'var(--color-slate)',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
                <span style={{ color: 'var(--color-productive-text)' }}>
                  Productive: {stats.productivePercentage}% ({formatDuration(stats.productiveSeconds)})
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  Non-productive: {stats.nonProductivePercentage}% ({formatDuration(stats.nonProductiveSeconds)})
                </span>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="card-jitter" style={{ padding: '20px 24px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Tracked</span>
                <div style={{ fontSize: '26px', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {formatDuration(stats.totalTrackedSeconds)}
                </div>
              </div>

              <div className="card-jitter" style={{ padding: '20px 24px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Avg Productive / Day</span>
                <div style={{ fontSize: '26px', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--color-productive-text)', marginTop: '4px' }}>
                  {formatDuration(stats.averageProductivePerDaySeconds)}
                </div>
              </div>

              <div className="card-jitter" style={{ padding: '20px 24px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Activities Logged</span>
                <div style={{ fontSize: '26px', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {stats.activityCount}
                </div>
              </div>
            </div>

            {/* Top Activities List */}
            <div className="card-jitter" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Top Activities</h3>

              {stats.topActivities.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>No activities logged in this range.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {stats.topActivities.map((act, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`badge-kicker ${act.category === 'productive' ? 'badge-productive' : 'badge-non-productive'}`}>
                          {act.category === 'productive' ? 'Productive' : 'Non-productive'}
                        </span>
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>{act.title}</span>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
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
