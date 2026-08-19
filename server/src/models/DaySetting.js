const mongoose = require('mongoose');

const daySettingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true
    },
    workStart: {
      type: String, // "09:00"
      default: null
    },
    workEnd: {
      type: String, // "17:00"
      default: null
    },
    isSet: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

daySettingSchema.index({ userId: 1, date: 1 }, { unique: true });

const DaySetting = mongoose.model('DaySetting', daySettingSchema);

module.exports = DaySetting;
