/**
 * Portfolio Backend Server
 * 
 * Main server file for the portfolio application.
 * Handles API routes, database connection, and middleware setup.
 * 
 * Features:
 * - REST API for portfolio content (projects, blogs, experience)
 * - Contact form with email notifications
 * - Visitor analytics tracking
 * - Admin authentication
 * - MongoDB integration
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/connection.js';
import { seedAdmin } from './seedAdmin.js';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import blogRoutes from './routes/blogs.js';
import projectRoutes from './routes/projects.js';
import experienceRoutes from './routes/experience.js';
import contactRoutes from './routes/contacts.js';
import analyticsRoutes from './routes/analytics.js';
import uploadRoutes from './routes/upload.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ========================================
// Middleware Configuration
// ========================================

// Enable CORS for cross-origin requests
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5001',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'https://portfolio1-client-v6cv.onrender.com',
      'https://portfolio1-admin-fe2h.onrender.com',
      process.env.CLIENT_URL,
      process.env.ADMIN_URL
    ].filter(Boolean);
    
    // In production, allow all render.com domains
    if (origin.includes('onrender.com') || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in production
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // Cache preflight for 10 minutes
}));

// Handle preflight requests explicitly
app.options('*', cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// ========================================
// Database Connection
// ========================================

connectDB().then(() => {
  console.log('✅ Database connected successfully');
  // Seed admin user after successful DB connection
  seedAdmin();
});

// ========================================
// API Routes
// ========================================

app.use('/api/auth', authRoutes);           // Authentication (login, register)
app.use('/api/profile', profileRoutes);     // Profile management
app.use('/api/blogs', blogRoutes);          // Blog posts CRUD
app.use('/api/projects', projectRoutes);    // Projects CRUD
app.use('/api/experience', experienceRoutes); // Experience/Work history
app.use('/api/contacts', contactRoutes);    // Contact form submissions
app.use('/api/analytics', analyticsRoutes); // Visitor analytics
app.use('/api/upload', uploadRoutes);       // Image uploads

// ========================================
// Health Check Endpoint
// ========================================

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Portfolio API Server',
    status: 'Active',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ========================================
// Start Server
// ========================================

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});

