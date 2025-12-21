import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  // Track unique visitors by IP or session
  ip: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
  },
  visitedAt: {
    type: Date,
    default: Date.now,
  },
  // Optional: track which pages they visited
  pages: [{
    path: String,
    visitedAt: Date,
  }],
}, {
  timestamps: true,
});

// Create indexes for better performance
visitorSchema.index({ ip: 1, visitedAt: -1 });

const Visitor = mongoose.model('Visitor', visitorSchema);

export default Visitor;
