/**
 * Time and date formatting utilities for Hourlee UI (12-hour AM/PM format)
 */

/**
 * Formats duration in seconds to "1h 24m" or "42m" or "18s"
 */
export const formatDuration = (totalSeconds) => {
  if (!totalSeconds || totalSeconds <= 0) return '0m';

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  }
  return `${seconds}s`;
};

/**
 * Formats duration in seconds into HH:MM:SS format for live running timers
 */
export const formatTimerDigits = (totalSeconds) => {
  if (!totalSeconds || totalSeconds < 0) return '00:00:00';
  const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(totalSeconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
};

/**
 * Converts 24-hour time string "17:00" or "09:30" to 12-hour AM/PM format "5:00 PM" / "9:30 AM"
 */
export const format12HourTime = (timeStr) => {
  if (!timeStr) return '';
  if (typeof timeStr !== 'string' || !timeStr.includes(':')) return timeStr;

  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h) || isNaN(m)) return timeStr;

  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;

  const minutesPadded = String(m).padStart(2, '0');
  return `${h}:${minutesPadded} ${ampm}`;
};

/**
 * Formats Date to "9:30 AM" 12-hour format
 */
export const formatTime = (dateObj) => {
  if (!dateObj) return 'Now';
  const d = new Date(dateObj);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
};

/**
 * Format date to YYYY-MM-DD
 */
export const getTodayDateString = (dateObj = new Date()) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formats YYYY-MM-DD date string to "Wednesday, August 19, 2026"
 */
export const formatDateReadable = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Converts Date object or ISO string to input format "HH:MM" for native <input type="time">
 */
export const toTimeString = (dateObj = new Date()) => {
  const d = new Date(dateObj);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Combines date string (YYYY-MM-DD) and time string (HH:MM) into a Date object
 */
export const parseDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null;
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
};
