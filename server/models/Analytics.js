import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  totalVisits: {
    type: Number,
    default: 0,
  },
  uniqueVisitors: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  // Daily stats
  dailyStats: [{
    date: {
      type: Date,
      required: true,
    },
    visits: {
      type: Number,
      default: 0,
    },
    uniqueVisitors: {
      type: Number,
      default: 0,
    },
  }],
}, {
  timestamps: true,
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;
