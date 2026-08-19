import React, { createContext, useContext, useState, useEffect } from 'react';
import { activityAPI } from '../services/api';
import { useAuth } from './AuthContext';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const { user } = useAuth();
  const [runningActivity, setRunningActivity] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Sync running activity from DB when user is authenticated or refreshed
  const refreshRunningActivity = async () => {
    if (!user) {
      setRunningActivity(null);
      setElapsedSeconds(0);
      return;
    }
    try {
      const data = await activityAPI.getActivities();
      if (data.runningActivity) {
        setRunningActivity(data.runningActivity);
      } else {
        setRunningActivity(null);
        setElapsedSeconds(0);
      }
    } catch (err) {
      console.error('[Timer Context Error]', err);
    }
  };

  useEffect(() => {
    refreshRunningActivity();
  }, [user]);

  // Live timer tick every second
  useEffect(() => {
    if (!runningActivity || !runningActivity.startTime) {
      setElapsedSeconds(0);
      return;
    }

    const calculateElapsed = () => {
      const startMs = new Date(runningActivity.startTime).getTime();
      const nowMs = Date.now();
      const diff = Math.max(0, Math.floor((nowMs - startMs) / 1000));
      setElapsedSeconds(diff);
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 1000);

    return () => clearInterval(interval);
  }, [runningActivity]);

  const stopTimer = async () => {
    if (!runningActivity) return null;
    try {
      const res = await activityAPI.stopActivity(runningActivity._id);
      setRunningActivity(null);
      setElapsedSeconds(0);
      return res;
    } catch (err) {
      console.error('[Stop Timer Error]', err);
      throw err;
    }
  };

  return (
    <TimerContext.Provider
      value={{
        runningActivity,
        setRunningActivity,
        elapsedSeconds,
        refreshRunningActivity,
        stopTimer
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
