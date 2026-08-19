const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Activity title is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['productive', 'non-productive'],
        message: 'Category must be productive or non-productive'
      }
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
      index: true
    },
    endTime: {
      type: Date,
      default: null
    },
    isRunning: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number, // Duration in seconds
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Compound index for user activity timeline queries
activitySchema.index({ userId: 1, startTime: 1 });

// Calculate duration pre-save
activitySchema.pre('save', function (next) {
  if (this.endTime && this.startTime) {
    const diffInMs = new Date(this.endTime) - new Date(this.startTime);
    this.duration = Math.max(0, Math.floor(diffInMs / 1000));
    this.isRunning = false;
  } else if (this.isRunning && this.startTime) {
    const diffInMs = new Date() - new Date(this.startTime);
    this.duration = Math.max(0, Math.floor(diffInMs / 1000));
  }
  next();
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
