import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { toast } from 'sonner';

const AdminLayout = ({ children }) => {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const currentLabel = useMemo(() => {
    const found = menuItems.find((m) => m.path === location);
    return found?.label || 'Admin Panel';
  }, [location]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`w-64 bg-gray-900 text-white flex-shrink-0 flex flex-col fixed h-full z-50 transform transition-transform md:translate-x-0 md:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:static md:transform-none`}
      >
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
                onClick={() => setSidebarOpen(false)}
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
      <div className="flex-1 overflow-y-auto md:ml-64">
        {/* Mobile top bar */}
        <div className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="px-3 py-2 rounded bg-gray-900 text-white"
            >
              ☰
            </button>
            <div className="font-semibold text-gray-900 truncate ml-3 flex-1">{currentLabel}</div>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2 rounded bg-gray-100 text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="p-4 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
