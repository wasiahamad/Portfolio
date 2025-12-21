import React from 'react';
import { Link, useLocation } from 'wouter';
import { toast } from 'sonner';

const AdminLayout = ({ children }) => {
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    toast.success('Logged out successfully!');
    setLocation('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/profile', icon: '👤', label: 'Profile' },
    { path: '/blogs', icon: '📝', label: 'Blogs' },
    { path: '/projects', icon: '💼', label: 'Projects' },
    { path: '/experience', icon: '⭐', label: 'Experience' },
    { path: '/contacts', icon: '📧', label: 'Contacts' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Fixed Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex-shrink-0 flex flex-col fixed h-full">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-gray-400 mt-1">Portfolio Dashboard</p>
        </div>
        <nav className="mt-6 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
            >
              <a
                className={`flex items-center px-6 py-3 hover:bg-gray-800 transition cursor-pointer ${
                  location === item.path ? 'bg-gray-800 border-l-4 border-blue-500' : ''
                }`}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                {item.label}
              </a>
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-6 py-3 hover:bg-gray-800 transition text-left border-t border-gray-700"
        >
          <span className="mr-3 text-xl">🚪</span>
          Logout
        </button>
      </div>

      {/* Scrollable Main Content */}
      <div className="flex-1 ml-64 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
