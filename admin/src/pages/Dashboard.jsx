import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    blogs: 0,
    projects: 0,
    experiences: 0,
    contacts: 0
  });

  const [analytics, setAnalytics] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    todayVisitors: 0,
    weekVisitors: 0,
    monthVisitors: 0
  });

  useEffect(() => {
    fetchStats();
    fetchAnalytics();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const [blogs, projects, experiences, contacts] = await Promise.all([
        axios.get('http://localhost:5000/api/blogs', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/projects', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/experiences', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/contacts', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setStats({
        blogs: blogs.data.length,
        projects: projects.data.length,
        experiences: experiences.data.length,
        contacts: contacts.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:5000/api/analytics/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const visitorCards = [
    { title: 'Total Visitors', count: analytics.uniqueVisitors, color: 'bg-blue-600', icon: '👥' },
    { title: 'Total Visits', count: analytics.totalVisits, color: 'bg-green-600', icon: '👁️' },
    { title: "Today's Visitors", count: analytics.todayVisitors, color: 'bg-purple-600', icon: '📅' },
    { title: 'This Week', count: analytics.weekVisitors, color: 'bg-orange-600', icon: '📈' }
  ];

  const contentCards = [
    { title: 'Total Blogs', count: stats.blogs, color: 'bg-indigo-500', icon: '📝' },
    { title: 'Total Projects', count: stats.projects, color: 'bg-cyan-500', icon: '💼' },
    { title: 'Total Experience', count: stats.experiences, color: 'bg-yellow-500', icon: '⭐' },
    { title: 'Total Contacts', count: stats.contacts, color: 'bg-pink-500', icon: '💬' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your portfolio.</p>
      </div>

      {/* Visitor Analytics Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span>👥</span>
          Visitor Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visitorCards.map((card, index) => (
            <div key={index} className={`${card.color} text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow`}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-medium opacity-90">{card.title}</h2>
                <span className="text-2xl">{card.icon}</span>
              </div>
              <p className="text-4xl font-bold">{card.count.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content Statistics Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span>📊</span>
          Content Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contentCards.map((card, index) => (
            <div key={index} className={`${card.color} text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow`}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-medium opacity-90">{card.title}</h2>
                <span className="text-2xl">{card.icon}</span>
              </div>
              <p className="text-4xl font-bold">{card.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Highlights */}
      {analytics.monthVisitors > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>📈</span>
            Performance Highlights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">This Month:</span>
              <span className="font-semibold">{analytics.monthVisitors} visitors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Average:</span>
              <span className="font-semibold">
                {Math.round(analytics.totalVisits / 30)} visits/day
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">Engagement:</span>
              <span className="font-semibold">
                {analytics.uniqueVisitors > 0
                  ? (analytics.totalVisits / analytics.uniqueVisitors).toFixed(1)
                  : 0}x per visitor
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
