import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Zap, Layers, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-wrap" style={{ paddingTop: '48px' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 72px' }}>
          <div style={{ marginBottom: '24px' }}>
            <span className="badge-kicker badge-lilac" style={{ padding: '6px 18px', fontSize: '13px' }}>
              <Clock size={14} />
              <span>Hourlee 2.0 · Visual Daily Time Tracker</span>
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 7.5vw, 84px)',
            fontWeight: 800,
            lineHeight: 1.02,
            letterSpacing: '-0.04em',
            marginBottom: '24px',
            color: 'var(--text-primary)'
          }}>
            Track your entire day in a single visual timeline.
          </h1>

          <p style={{
            fontSize: '19px',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: '660px',
            margin: '0 auto 40px'
          }}>
            Hourlee structures your day around your core productivity window. Track activities with open-ended stopwatches, link consecutive tasks automatically, and fill unlogged time gaps effortlessly.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {user ? (
              <button onClick={() => navigate('/today')} className="btn-pill btn-pill-violet" style={{ padding: '16px 40px', fontSize: '16px' }}>
                <span>Open Your Timeline</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <>
                <Link to="/signup" className="btn-pill btn-pill-violet" style={{ padding: '16px 40px', fontSize: '16px' }}>
                  <span>Start Tracking Free</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn-pill btn-pill-quiet" style={{ padding: '16px 36px', fontSize: '16px' }}>
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Feature Showcase Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', marginBottom: '80px' }}>
          
          {/* Feature 1: Living Daily Timeline */}
          <div className="card-jitter" style={{ padding: '36px' }}>
            <span className="badge-kicker badge-lilac" style={{ marginBottom: '16px' }}>Visual System</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>
              Living Daily Timeline
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
              Chronologically orders every activity from morning to night. Automatically links consecutive tasks and highlights unlogged time gaps with quiet 1-click loggers.
            </p>

            {/* Visual Timeline UI Snippet Preview */}
            <div style={{
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '24px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>09:00 AM – 11:30 AM</span>
                  <p style={{ fontSize: '14px', fontWeight: 700 }}>Coding Hourlee App</p>
                </div>
                <span className="badge-kicker badge-productive">Productive</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>11:30 AM – 12:30 PM</span>
                  <p style={{ fontSize: '14px', fontWeight: 700 }}>Lunch & Break</p>
                </div>
                <span className="badge-kicker badge-non-productive">Non-productive</span>
              </div>
            </div>
          </div>

          {/* Feature 2: Active Stopwatch Engine */}
          <div className="card-jitter" style={{ padding: '36px' }}>
            <span className="badge-kicker badge-lilac" style={{ marginBottom: '16px' }}>Stopwatch Engine</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>
              Resilient Open Stopwatch
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
              Start an activity and close your browser. Hourlee calculates exact duration from server timestamps and lets you toggle categories with 1-click or keyboard shortcuts.
            </p>

            {/* Stopwatch Ticker UI Snippet Preview */}
            <div style={{
              background: 'var(--bg-card)',
              border: '2px solid var(--color-eclipse-violet)',
              borderRadius: '24px',
              padding: '18px 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-eclipse-violet)' }} />
                  <span className="badge-kicker badge-productive" style={{ fontSize: '11px', padding: '2px 10px' }}>Productive</span>
                </div>
                <p style={{ fontSize: '15px', fontWeight: 800 }}>Studying System Design</p>
              </div>

              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
                01:42:08
              </div>
            </div>
          </div>

          {/* Feature 3: 3-Zone Focus Window */}
          <div className="card-jitter" style={{ padding: '36px' }}>
            <span className="badge-kicker badge-lilac" style={{ marginBottom: '16px' }}>Productivity Window</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>
              3-Zone Focus Windows
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
              Defines your core work hours (e.g. 9:00 AM – 5:00 PM). Partition your daily timeline into pre-work, core focus, and evening relaxation zones automatically.
            </p>

            {/* Productivity Goal Progress Preview */}
            <div style={{
              background: 'var(--color-productive-bg)',
              border: '1px solid var(--color-productive-border)',
              borderRadius: '24px',
              padding: '18px 22px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-productive-text)' }}>Core Focus Hours</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-productive-text)' }}>78% Focus</span>
              </div>

              <div style={{ height: '8px', borderRadius: '4px', background: 'var(--border-subtle)', overflow: 'hidden' }}>
                <div style={{ width: '78%', height: '100%', background: 'var(--color-eclipse-violet)', borderRadius: '4px' }} />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
