import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import DateNavigator from '../components/DateNavigator';
import StopwatchTicker from '../components/StopwatchTicker';
import ProductivityWindowPrompt from '../components/ProductivityWindowPrompt';
import IntegratedHeaderBar from '../components/IntegratedHeaderBar';
import FastInlineComposer from '../components/FastInlineComposer';
import Timeline from '../components/Timeline';
import AddActivityModal from '../components/AddActivityModal';
import EditActivityModal from '../components/EditActivityModal';
import { activityAPI } from '../services/api';
import { getTodayDateString } from '../utils/formatters';

export default function Today() {
  const [currentDateStr, setCurrentDateStr] = useState(getTodayDateString());
  const [summary, setSummary] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [runningActivity, setRunningActivity] = useState(null);
  const [daySetting, setDaySetting] = useState(null);
  const [productivityWindow, setProductivityWindow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Past task modal states
  const [isPastModalOpen, setIsPastModalOpen] = useState(false);
  const [initialStart, setInitialStart] = useState(null);
  const [initialEnd, setInitialEnd] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);

  const loadDayData = useCallback(async (dateStr) => {
    try {
      const data = await activityAPI.getActivities(dateStr);
      setSummary(data.summary);
      setTimeline(data.timeline);
      setRunningActivity(data.runningActivity);
      setDaySetting(data.daySetting);
      setProductivityWindow(data.productivityWindow);
    } catch (err) {
      console.error('[Error loading timeline]', err);
      setError(err.message || 'Failed to load timeline');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDayData(currentDateStr);
  }, [currentDateStr, loadDayData]);

  const handleStartStopwatch = async (taskData) => {
    try {
      await activityAPI.createActivity(taskData);
      await loadDayData(currentDateStr);
    } catch (err) {
      console.error('Failed to start stopwatch', err);
    }
  };

  // Toggle category on current running activity
  const handleToggleCategory = async (id, targetCategory) => {
    try {
      await activityAPI.updateActivity(id, { category: targetCategory });
      await loadDayData(currentDateStr);
    } catch (err) {
      console.error('Failed to toggle category', err);
    }
  };

  // End current running activity & start new stopwatch starting NOW
  const handleSwitchToNewCategory = async (targetCategory) => {
    try {
      const defaultTitle = targetCategory === 'productive' ? 'Productive Focus' : 'Unproductive Break';
      await activityAPI.createActivity({
        title: defaultTitle,
        category: targetCategory,
        startTime: new Date()
      });
      await loadDayData(currentDateStr);
    } catch (err) {
      console.error('Failed to switch to new category stopwatch', err);
    }
  };

  const handleSaveProductivityWindow = async (workStart, workEnd) => {
    try {
      await activityAPI.setProductivityWindow(currentDateStr, workStart, workEnd, false);
      await loadDayData(currentDateStr);
    } catch (err) {
      console.error('Failed to set productivity window', err);
    }
  };

  const handleCreatePastActivity = async (activityData) => {
    const res = await activityAPI.createActivity(activityData);
    await loadDayData(currentDateStr);
    return res;
  };

  const handleFillGapInline = async (start, end, title, category) => {
    try {
      await activityAPI.createActivity({
        title,
        category: category || 'productive',
        startTime: start,
        endTime: end
      });
      await loadDayData(currentDateStr);
    } catch (err) {
      console.error('Failed to fill gap inline', err);
    }
  };

  const handleUpdateActivity = async (id, updateData) => {
    const res = await activityAPI.updateActivity(id, updateData);
    await loadDayData(currentDateStr);
    return res;
  };

  const handleDeleteActivity = async (id) => {
    try {
      await activityAPI.deleteActivity(id);
      await loadDayData(currentDateStr);
    } catch (err) {
      console.error('Failed to delete activity', err);
    }
  };

  const handleStopStopwatch = async (id) => {
    try {
      await activityAPI.stopActivity(id);
      await loadDayData(currentDateStr);
    } catch (err) {
      console.error('Failed to stop stopwatch', err);
    }
  };

  const handleOpenPastModal = (start = null, end = null) => {
    setInitialStart(start);
    setInitialEnd(end);
    setIsPastModalOpen(true);
  };

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-wrap">
        <DateNavigator
          currentDateStr={currentDateStr}
          onDateChange={(newDate) => setCurrentDateStr(newDate)}
        />

        {/* 1. Daily Productivity Window Setup Banner */}
        {daySetting && !daySetting.isSet && (
          <ProductivityWindowPrompt
            onSaveWindow={handleSaveProductivityWindow}
          />
        )}

        {/* 2. Live Active Stopwatch Ticker with 1-Click Category Switch Shortcut */}
        <StopwatchTicker
          runningActivity={runningActivity}
          onStop={handleStopStopwatch}
          onToggleCategory={handleToggleCategory}
          onSwitchToNewCategory={handleSwitchToNewCategory}
        />

        {/* 3. Fast Task Composer */}
        <FastInlineComposer
          onStartStopwatch={handleStartStopwatch}
          onOpenPastModal={() => handleOpenPastModal()}
        />

        {/* 4. Integrated Header Overview */}
        <IntegratedHeaderBar
          summary={summary}
          productivityWindow={productivityWindow}
        />

        {/* 5. Partitioned Visual Timeline */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-secondary)' }}>
            Loading timeline...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: '#e11d48' }}>
            {error}
          </div>
        ) : (
          <Timeline
            timeline={timeline}
            productivityWindow={productivityWindow}
            onEdit={(act) => setEditingActivity(act)}
            onDelete={handleDeleteActivity}
            onStop={handleStopStopwatch}
            onFillGap={(start, end) => handleOpenPastModal(start, end)}
          />
        )}

        {/* Add Past Activity Range Modal */}
        <AddActivityModal
          isOpen={isPastModalOpen}
          onClose={() => setIsPastModalOpen(false)}
          onSubmit={handleCreatePastActivity}
          initialStart={initialStart}
          initialEnd={initialEnd}
          currentDateStr={currentDateStr}
        />

        {/* Edit Activity Modal */}
        <EditActivityModal
          isOpen={!!editingActivity}
          onClose={() => setEditingActivity(null)}
          onSubmit={handleUpdateActivity}
          activity={editingActivity}
          currentDateStr={currentDateStr}
        />
      </main>
    </div>
  );
}
