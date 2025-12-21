import express from 'express';
import Visitor from '../models/Visitor.js';
import Analytics from '../models/Analytics.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Helper function to get client IP
const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() || 
         req.headers['x-real-ip'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         'unknown';
};

// Track a visit (public endpoint)
router.post('/track', async (req, res) => {
  try {
    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const page = req.body.page || '/';
    
    // Check if this IP visited today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingVisitor = await Visitor.findOne({
      ip,
      visitedAt: { $gte: today }
    });
    
    let isUniqueToday = false;
    
    if (existingVisitor) {
      // Update existing visitor with new page
      existingVisitor.pages.push({
        path: page,
        visitedAt: new Date()
      });
      await existingVisitor.save();
    } else {
      // New visitor for today
      isUniqueToday = true;
      await Visitor.create({
        ip,
        userAgent,
        pages: [{
          path: page,
          visitedAt: new Date()
        }]
      });
    }
    
    // Update analytics
    await updateAnalytics(isUniqueToday);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    res.status(500).json({ success: false, message: 'Failed to track visit' });
  }
});

// Get analytics (admin only)
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    let analytics = await Analytics.findOne();
    
    if (!analytics) {
      analytics = await Analytics.create({
        totalVisits: 0,
        uniqueVisitors: 0,
        dailyStats: []
      });
    }
    
    // Get today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayVisitors = await Visitor.countDocuments({
      visitedAt: { $gte: today }
    });
    
    // Get this week's stats
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekVisitors = await Visitor.countDocuments({
      visitedAt: { $gte: weekAgo }
    });
    
    // Get this month's stats
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    const monthVisitors = await Visitor.countDocuments({
      visitedAt: { $gte: monthAgo }
    });
    
    res.json({
      totalVisits: analytics.totalVisits,
      uniqueVisitors: analytics.uniqueVisitors,
      todayVisitors,
      weekVisitors,
      monthVisitors,
      dailyStats: analytics.dailyStats.slice(-30), // Last 30 days
      lastUpdated: analytics.lastUpdated
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

// Get all visitors (admin only)
router.get('/visitors', authMiddleware, async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    
    const visitors = await Visitor.find()
      .sort({ visitedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Visitor.countDocuments();
    
    res.json({
      visitors,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching visitors:', error);
    res.status(500).json({ message: 'Failed to fetch visitors' });
  }
});

// Helper function to update analytics
async function updateAnalytics(isUniqueVisitor) {
  try {
    let analytics = await Analytics.findOne();
    
    if (!analytics) {
      analytics = await Analytics.create({
        totalVisits: 0,
        uniqueVisitors: 0,
        dailyStats: []
      });
    }
    
    // Increment total visits
    analytics.totalVisits += 1;
    
    // Increment unique visitors if this is a new visitor today
    if (isUniqueVisitor) {
      analytics.uniqueVisitors += 1;
    }
    
    // Update daily stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayStats = analytics.dailyStats.find(stat => 
      stat.date.getTime() === today.getTime()
    );
    
    if (todayStats) {
      todayStats.visits += 1;
      if (isUniqueVisitor) {
        todayStats.uniqueVisitors += 1;
      }
    } else {
      analytics.dailyStats.push({
        date: today,
        visits: 1,
        uniqueVisitors: isUniqueVisitor ? 1 : 0
      });
    }
    
    // Keep only last 90 days of daily stats
    if (analytics.dailyStats.length > 90) {
      analytics.dailyStats = analytics.dailyStats.slice(-90);
    }
    
    analytics.lastUpdated = new Date();
    await analytics.save();
  } catch (error) {
    console.error('Error updating analytics:', error);
  }
}

export default router;
