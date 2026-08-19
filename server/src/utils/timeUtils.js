/**
 * Utility functions for time calculations, timeline validation, and gap detection
 */

const checkOverlap = (existingActivities, newStart, newEnd, excludeId = null) => {
  const startMs = new Date(newStart).getTime();
  const endMs = newEnd ? new Date(newEnd).getTime() : Date.now();

  for (const act of existingActivities) {
    if (excludeId && act._id.toString() === excludeId.toString()) {
      continue;
    }

    // Skip open-ended activities that are about to be closed by this new activity
    if (!act.endTime && !newEnd) {
      continue;
    }

    const actStartMs = new Date(act.startTime).getTime();
    const actEndMs = act.endTime ? new Date(act.endTime).getTime() : Date.now();

    if (startMs < actEndMs && actStartMs < endMs) {
      return {
        hasOverlap: true,
        conflictingActivity: act
      };
    }
  }

  return { hasOverlap: false, conflictingActivity: null };
};

const getDayBounds = (dateString) => {
  let d;
  if (!dateString) {
    d = new Date();
  } else if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-').map(Number);
    d = new Date(year, month - 1, day);
  } else {
    d = new Date(dateString);
  }

  const startOfDay = new Date(d);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(d);
  endOfDay.setHours(23, 59, 59, 999);

  return { startOfDay, endOfDay };
};

const calculateDayTimeline = (activities, startOfDay, endOfDay) => {
  const sorted = [...activities].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  const timeline = [];
  const now = new Date();
  const dayUpperLimit = now < endOfDay ? now : endOfDay;

  let cursor = new Date(startOfDay);

  for (let i = 0; i < sorted.length; i++) {
    const act = sorted[i];
    const actStart = new Date(act.startTime);

    // Determine effective end time
    let actEnd;
    if (act.endTime) {
      actEnd = new Date(act.endTime);
    } else if (i < sorted.length - 1) {
      actEnd = new Date(sorted[i + 1].startTime);
    } else {
      actEnd = now < endOfDay ? now : endOfDay;
    }

    // Unlogged gap before this activity
    if (actStart.getTime() - cursor.getTime() >= 60000 && cursor < dayUpperLimit) {
      const gapEnd = actStart < dayUpperLimit ? actStart : dayUpperLimit;
      if (gapEnd > cursor) {
        timeline.push({
          type: 'gap',
          startTime: new Date(cursor),
          endTime: new Date(gapEnd),
          duration: Math.floor((gapEnd.getTime() - cursor.getTime()) / 1000)
        });
      }
    }

    timeline.push({
      type: 'activity',
      data: {
        ...act.toObject ? act.toObject() : act,
        effectiveEndTime: actEnd
      }
    });

    if (actEnd > cursor) {
      cursor = new Date(actEnd);
    }
  }

  // Trailing gap to now / end of day
  if (dayUpperLimit.getTime() - cursor.getTime() >= 60000) {
    timeline.push({
      type: 'gap',
      startTime: new Date(cursor),
      endTime: new Date(dayUpperLimit),
      duration: Math.floor((dayUpperLimit.getTime() - cursor.getTime()) / 1000)
    });
  }

  return timeline;
};

/**
 * Calculates productive time within user's productivity window (e.g. 09:00 to 17:00)
 */
const calculateProductivityWindowStats = (activities, dateStr, workStart, workEnd) => {
  if (!workStart || !workEnd) return null;

  const [year, month, day] = dateStr.split('-').map(Number);
  const [sH, sM] = workStart.split(':').map(Number);
  const [eH, eM] = workEnd.split(':').map(Number);

  const windowStart = new Date(year, month - 1, day, sH, sM, 0, 0);
  const windowEnd = new Date(year, month - 1, day, eH, eM, 0, 0);

  const windowTotalSeconds = Math.max(0, Math.floor((windowEnd - windowStart) / 1000));
  let windowProductiveSeconds = 0;
  let windowNonProductiveSeconds = 0;

  const now = new Date();

  activities.forEach((act) => {
    const actStart = new Date(act.startTime);
    const actEnd = act.endTime ? new Date(act.endTime) : (now < windowEnd ? now : windowEnd);

    // Overlap of activity with productivity window [windowStart, windowEnd]
    const overlapStart = new Date(Math.max(actStart.getTime(), windowStart.getTime()));
    const overlapEnd = new Date(Math.min(actEnd.getTime(), windowEnd.getTime()));

    if (overlapStart < overlapEnd) {
      const dur = Math.floor((overlapEnd - overlapStart) / 1000);
      if (act.category === 'productive') {
        windowProductiveSeconds += dur;
      } else {
        windowNonProductiveSeconds += dur;
      }
    }
  });

  const percentage = windowTotalSeconds > 0 ? Math.min(100, Math.round((windowProductiveSeconds / windowTotalSeconds) * 100)) : 0;

  return {
    workStart,
    workEnd,
    windowTotalSeconds,
    windowProductiveSeconds,
    windowNonProductiveSeconds,
    percentage
  };
};

module.exports = {
  checkOverlap,
  getDayBounds,
  calculateDayTimeline,
  calculateProductivityWindowStats
};
