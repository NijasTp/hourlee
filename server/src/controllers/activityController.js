const Activity = require('../models/Activity');
const DaySetting = require('../models/DaySetting');
const {
  checkOverlap,
  getDayBounds,
  calculateDayTimeline,
  calculateProductivityWindowStats
} = require('../utils/timeUtils');

const formatDateKey = (d) => {
  const date = new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// @desc    Get activities for a specific day with summary & timeline breakdown
// @route   GET /api/activities?date=YYYY-MM-DD
// @access  Private
const getActivities = async (req, res, next) => {
  try {
    const { date } = req.query;
    const dateKey = date || formatDateKey(new Date());
    const { startOfDay, endOfDay } = getDayBounds(dateKey);

    // Fetch activities for user for this day
    const activities = await Activity.find({
      userId: req.user._id,
      $or: [
        { startTime: { $gte: startOfDay, $lte: endOfDay } },
        { endTime: { $gte: startOfDay, $lte: endOfDay } },
        { isRunning: true, startTime: { $lte: endOfDay } }
      ]
    }).sort({ startTime: 1 });

    // Fetch DaySetting for user
    let daySetting = await DaySetting.findOne({
      userId: req.user._id,
      date: dateKey
    });

    // Auto-link end times for consecutive stopwatch activities if missing
    for (let i = 0; i < activities.length - 1; i++) {
      if (!activities[i].endTime) {
        activities[i].endTime = activities[i + 1].startTime;
        activities[i].isRunning = false;
        await activities[i].save();
      }
    }

    const runningActivity = await Activity.findOne({
      userId: req.user._id,
      isRunning: true
    });

    const now = new Date();
    let productiveSeconds = 0;
    let nonProductiveSeconds = 0;

    activities.forEach((act) => {
      let dur = act.duration;
      if (act.isRunning) {
        dur = Math.max(0, Math.floor((now - new Date(act.startTime)) / 1000));
      } else if (!act.endTime && act.startTime) {
        dur = Math.max(0, Math.floor((now - new Date(act.startTime)) / 1000));
      }

      if (act.category === 'productive') {
        productiveSeconds += dur;
      } else {
        nonProductiveSeconds += dur;
      }
    });

    const totalTrackedSeconds = productiveSeconds + nonProductiveSeconds;
    const timeline = calculateDayTimeline(activities, startOfDay, endOfDay);

    let unloggedSeconds = 0;
    timeline.forEach((item) => {
      if (item.type === 'gap') {
        unloggedSeconds += item.duration;
      }
    });

    // Productivity hours stats calculation
    const effectiveWorkStart = (daySetting && daySetting.workStart) ? daySetting.workStart : '09:00';
    const effectiveWorkEnd = (daySetting && daySetting.workEnd) ? daySetting.workEnd : '17:00';

    const productivityWindow = calculateProductivityWindowStats(
      activities,
      dateKey,
      effectiveWorkStart,
      effectiveWorkEnd
    );

    res.json({
      success: true,
      date: dateKey,
      daySetting: daySetting || { isSet: false, workStart: '09:00', workEnd: '17:00' },
      productivityWindow,
      summary: {
        totalTrackedSeconds,
        productiveSeconds,
        nonProductiveSeconds,
        unloggedSeconds,
        activityCount: activities.length
      },
      activities,
      timeline,
      runningActivity
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set or update productivity work hours for a day
// @route   POST /api/activities/productivity-window
// @access  Private
const setProductivityWindow = async (req, res, next) => {
  try {
    const { date, workStart, workEnd } = req.body;
    const dateKey = date || formatDateKey(new Date());

    let setting = await DaySetting.findOne({
      userId: req.user._id,
      date: dateKey
    });

    if (!setting) {
      setting = new DaySetting({
        userId: req.user._id,
        date: dateKey
      });
    }

    setting.isSet = true;
    setting.workStart = workStart || '09:00';
    setting.workEnd = workEnd || '17:00';

    await setting.save();

    res.json({
      success: true,
      daySetting: setting
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get history of days
// @route   GET /api/activities/history
// @access  Private
const getHistory = async (req, res, next) => {
  try {
    const activities = await Activity.find({ userId: req.user._id }).sort({ startTime: -1 });
    const daysMap = {};
    const now = new Date();

    activities.forEach((act) => {
      const dateKey = formatDateKey(act.startTime);
      if (!daysMap[dateKey]) {
        daysMap[dateKey] = {
          date: dateKey,
          productiveSeconds: 0,
          nonProductiveSeconds: 0,
          totalTrackedSeconds: 0,
          activityCount: 0
        };
      }

      let dur = act.duration;
      if (act.isRunning || (!act.endTime && act.startTime)) {
        dur = Math.max(0, Math.floor((now - new Date(act.startTime)) / 1000));
      }

      if (act.category === 'productive') {
        daysMap[dateKey].productiveSeconds += dur;
      } else {
        daysMap[dateKey].nonProductiveSeconds += dur;
      }

      daysMap[dateKey].totalTrackedSeconds += dur;
      daysMap[dateKey].activityCount += 1;
    });

    const historyList = Object.values(daysMap).sort((a, b) => b.date.localeCompare(a.date));

    res.json({
      success: true,
      history: historyList
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new activity (Stopwatch Mode)
// @route   POST /api/activities
// @access  Private
const createActivity = async (req, res, next) => {
  try {
    const { title, category, startTime, endTime } = req.body;

    if (!title || !category) {
      return res.status(400).json({ success: false, message: 'Title and category are required' });
    }

    if (!['productive', 'non-productive'].includes(category)) {
      return res.status(400).json({ success: false, message: 'Category must be productive or non-productive' });
    }

    const start = startTime ? new Date(startTime) : new Date();
    const end = endTime ? new Date(endTime) : null;

    // STEP 1: First, close any currently running/open stopwatch by setting its endTime = start
    const openActivities = await Activity.find({
      userId: req.user._id,
      $or: [{ isRunning: true }, { endTime: null }]
    });

    for (const act of openActivities) {
      if (new Date(act.startTime) <= start) {
        act.endTime = start;
        act.isRunning = false;
        await act.save();
      }
    }

    // STEP 2: Now create and save the new activity
    const newActivity = new Activity({
      userId: req.user._id,
      title: title.trim(),
      category,
      startTime: start,
      endTime: end,
      isRunning: !end
    });

    await newActivity.save();

    res.status(201).json({
      success: true,
      activity: newActivity
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Stop a running stopwatch activity
// @route   POST /api/activities/:id/stop
// @access  Private
const stopActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findOne({ _id: req.params.id, userId: req.user._id });

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    activity.isRunning = false;
    if (req.body.endTime) {
      activity.endTime = new Date(req.body.endTime);
    } else {
      activity.endTime = new Date();
    }

    await activity.save();

    res.json({
      success: true,
      activity
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an activity
// @route   PATCH /api/activities/:id
// @access  Private
const updateActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findOne({ _id: req.params.id, userId: req.user._id });

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    const { title, category, startTime, endTime, isRunning } = req.body;

    if (title !== undefined) activity.title = title.trim();
    if (category !== undefined) {
      if (!['productive', 'non-productive'].includes(category)) {
        return res.status(400).json({ success: false, message: 'Invalid category' });
      }
      activity.category = category;
    }

    if (startTime) activity.startTime = new Date(startTime);
    if (endTime !== undefined) activity.endTime = endTime ? new Date(endTime) : null;
    if (isRunning !== undefined) activity.isRunning = isRunning;

    await activity.save();

    res.json({
      success: true,
      activity
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an activity
// @route   DELETE /api/activities/:id
// @access  Private
const deleteActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    res.json({
      success: true,
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActivities,
  setProductivityWindow,
  getHistory,
  createActivity,
  stopActivity,
  updateActivity,
  deleteActivity
};
