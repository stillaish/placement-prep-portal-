import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: 'grid_view', path: '/dashboard' },
    { name: 'Questions', icon: 'description', path: '/questions' },
    { name: 'Mock Tests', icon: 'timer', path: '/mock-tests' },
    { name: 'Roadmaps', icon: 'alt_route', path: '/roadmaps' },
    { name: 'Resources', icon: 'library_books', path: '/resources' },
    { name: 'Planner', icon: 'event_note', path: '/planner' },
  ];

  return (
    <aside className="h-screen w-64 border-r fixed left-0 top-0 bg-white border-gray-100 flex flex-col z-50">
      {/* Logo Section */}
      <div className="px-8 py-10 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-[18px]">terminal</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900">PrepPortal</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center px-4 py-3 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 font-bold shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span className="material-symbols-outlined mr-4">{item.icon}</span>
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            className={({ isActive }) => 
              `flex items-center px-4 py-3 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 font-bold shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span className="material-symbols-outlined mr-4">admin_panel_settings</span>
            <span className="text-sm">Admin Panel</span>
          </NavLink>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto px-4 pb-8 space-y-4">
        <NavLink
          to="/settings"
          className={({ isActive }) => 
            `flex items-center px-4 py-3 rounded-2xl transition-all duration-300 ${
              isActive 
                ? 'bg-blue-50 text-blue-700 font-bold' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <span className="material-symbols-outlined mr-4">settings</span>
          <span className="text-sm">Settings</span>
        </NavLink>

        {/* User Card */}
        <button 
          onClick={() => navigate('/profile')}
          className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-3xl border border-gray-100 hover:bg-gray-100 transition-all text-left"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&q=80&w=100" alt="User" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate">{user?.name || 'Alex Chen'}</p>
            <p className="text-[8px] font-bold text-primary uppercase tracking-widest">PRO MEMBER</p>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
