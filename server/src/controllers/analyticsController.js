const Activity = require('../models/Activity');
const { getDayBounds } = require('../utils/timeUtils');

// @desc    Get user analytics data for today, week, or month
// @route   GET /api/analytics?range=today|week|month
// @access  Private
const getAnalytics = async (req, res, next) => {
  try {
    const range = req.query.range || 'today';
    const now = new Date();
    let startDate = new Date();

    if (range === 'today') {
      startDate.setHours(0, 0, 0, 0);
    } else if (range === 'week') {
      startDate.setDate(now.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
    } else if (range === 'month') {
      startDate.setMonth(now.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
    }

    const activities = await Activity.find({
      userId: req.user._id,
      startTime: { $gte: startDate }
    }).sort({ startTime: 1 });

    let productiveSeconds = 0;
    let nonProductiveSeconds = 0;
    let longestActivity = null;
    let maxDuration = -1;

    const titleStats = {};
    const daysSet = new Set();

    activities.forEach((act) => {
      let dur = act.duration;
      if (act.isRunning) {
        dur = Math.max(0, Math.floor((now - new Date(act.startTime)) / 1000));
      }

      const dayKey = new Date(act.startTime).toISOString().split('T')[0];
      daysSet.add(dayKey);

      if (act.category === 'productive') {
        productiveSeconds += dur;
      } else {
        nonProductiveSeconds += dur;
      }

      if (dur > maxDuration) {
        maxDuration = dur;
        longestActivity = {
          title: act.title,
          category: act.category,
          duration: dur,
          startTime: act.startTime,
          endTime: act.endTime || now
        };
      }

      // Title aggregation
      if (!titleStats[act.title]) {
        titleStats[act.title] = {
          title: act.title,
          category: act.category,
          count: 0,
          totalDuration: 0
        };
      }
      titleStats[act.title].count += 1;
      titleStats[act.title].totalDuration += dur;
    });

    const totalTrackedSeconds = productiveSeconds + nonProductiveSeconds;
    const productivePercentage = totalTrackedSeconds > 0 ? Math.round((productiveSeconds / totalTrackedSeconds) * 100) : 0;
    const nonProductivePercentage = totalTrackedSeconds > 0 ? 100 - productivePercentage : 0;

    const daysCount = Math.max(1, daysSet.size);
    const averageProductivePerDaySeconds = Math.round(productiveSeconds / daysCount);

    const topActivities = Object.values(titleStats)
      .sort((a, b) => b.totalDuration - a.totalDuration)
      .slice(0, 5);

    res.json({
      success: true,
      range,
      stats: {
        totalTrackedSeconds,
        productiveSeconds,
        nonProductiveSeconds,
        productivePercentage,
        nonProductivePercentage,
        averageProductivePerDaySeconds,
        activityCount: activities.length,
        daysTracked: daysCount,
        longestActivity,
        topActivities
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalytics
};
