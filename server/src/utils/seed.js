const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Activity = require('../models/Activity');

dotenv.config({ path: __dirname + '/../../.env' });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hourlee');
    console.log('[Seed] Connected to MongoDB');

    // Find or create test user
    let user = await User.findOne({ username: 'demo' });
    if (!user) {
      user = await User.create({
        username: 'demo',
        email: 'demo@hourlee.app',
        passwordHash: 'password123'
      });
      console.log('[Seed] Created demo user: username "demo", password "password123"');
    } else {
      console.log('[Seed] Found existing demo user');
    }

    // Clear existing activities for demo user
    await Activity.deleteMany({ userId: user._id });
    console.log('[Seed] Cleared existing activities for demo user');

    const today = new Date();

    const createDateAt = (dayOffset, hours, minutes) => {
      const d = new Date(today);
      d.setDate(d.getDate() - dayOffset);
      d.setHours(hours, minutes, 0, 0);
      return d;
    };

    const sampleActivities = [
      // Today
      { title: 'Morning Coffee & Planning', category: 'non-productive', start: createDateAt(0, 8, 30), end: createDateAt(0, 9, 0) },
      { title: 'Coding Hourlee App', category: 'productive', start: createDateAt(0, 9, 0), end: createDateAt(0, 11, 30) },
      { title: 'DSA Practice & LeetCode', category: 'productive', start: createDateAt(0, 11, 45), end: createDateAt(0, 13, 0) },
      { title: 'Lunch & Break', category: 'non-productive', start: createDateAt(0, 13, 0), end: createDateAt(0, 14, 0) },
      { title: 'System Architecture & Docs', category: 'productive', start: createDateAt(0, 14, 15), end: createDateAt(0, 16, 30) },
      { title: 'YouTube Tech Reviews', category: 'non-productive', start: createDateAt(0, 16, 45), end: createDateAt(0, 17, 30) },
      { title: 'Gym Workout', category: 'productive', start: createDateAt(0, 17, 30), end: createDateAt(0, 19, 0) },

      // Yesterday
      { title: 'Morning Jog & Breakfast', category: 'productive', start: createDateAt(1, 8, 0), end: createDateAt(1, 9, 15) },
      { title: 'Backend API Refactoring', category: 'productive', start: createDateAt(1, 9, 30), end: createDateAt(1, 12, 45) },
      { title: 'Lunch with Teammates', category: 'non-productive', start: createDateAt(1, 13, 0), end: createDateAt(1, 14, 0) },
      { title: 'Debugging Mongo Queries', category: 'productive', start: createDateAt(1, 14, 0), end: createDateAt(1, 17, 0) },
      { title: 'Social Media & Free Time', category: 'non-productive', start: createDateAt(1, 17, 30), end: createDateAt(1, 19, 0) },
      { title: 'Reading Tech Books', category: 'productive', start: createDateAt(1, 20, 0), end: createDateAt(1, 21, 30) },

      // 2 Days Ago
      { title: 'Studying React & Redux', category: 'productive', start: createDateAt(2, 9, 0), end: createDateAt(2, 12, 0) },
      { title: 'Gaming & Anime', category: 'non-productive', start: createDateAt(2, 14, 0), end: createDateAt(2, 16, 30) },
      { title: 'Building Portfolio', category: 'productive', start: createDateAt(2, 17, 0), end: createDateAt(2, 20, 0) }
    ];

    for (const act of sampleActivities) {
      await Activity.create({
        userId: user._id,
        title: act.title,
        category: act.category,
        startTime: act.start,
        endTime: act.end,
        isRunning: false
      });
    }

    console.log(`[Seed] Successfully seeded ${sampleActivities.length} sample activities!`);
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]', err);
    process.exit(1);
  }
};

seedData();
