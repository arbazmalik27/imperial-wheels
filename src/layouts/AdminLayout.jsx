import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTachometerAlt, FaCar, FaCalendarCheck, FaClipboardList, FaUsers,
  FaChartBar, FaStar, FaCommentAlt, FaBell, FaCog, FaBars,
  FaSignOutAlt, FaChevronDown, FaCarSide
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { getNotifications } from '../utils/dataStore';
import { ROUTES } from '../constants/routes';

const navItems = [
  { path: '/admin/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
  { path: '/admin/cars', icon: FaCar, label: 'Cars' },
  { path: '/admin/bookings', icon: FaCalendarCheck, label: 'Bookings' },
  { path: '/admin/sell-requests', icon: FaClipboardList, label: 'Sell Requests' },
  { path: '/admin/users', icon: FaUsers, label: 'Users' },
  { path: '/admin/analytics', icon: FaChartBar, label: 'Analytics' },
  { path: '/admin/featured', icon: FaStar, label: 'Featured Cars' },
  { path: '/admin/reviews', icon: FaCommentAlt, label: 'Reviews' },
  { path: '/admin/notifications', icon: FaBell, label: 'Notifications' },
  { path: '/admin/settings', icon: FaCog, label: 'Settings' },
];

// Declared outside AdminLayout: creating a component inside a parent's
// render body would remount it (and reset any internal state) on every
// re-render of the parent.
const SidebarContent = ({ unreadCount, user, onNavigate, onLogout }) => (
  <div className="flex flex-col h-full">
    {/* Logo */}
    <div className="px-6 py-5 border-b border-white/5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
          <FaCarSide className="text-white text-base" />
        </div>
        <div>
          <span className="text-base font-black text-white tracking-tight leading-none block">Imperial</span>
          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Admin Panel</span>
        </div>
      </div>
    </div>

    {/* Nav links */}
    <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
      {navItems.map(({ path, icon: Icon, label }) => (
        <NavLink
          key={path}
          to={path}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-blue-600 rounded-xl"
                  style={{ zIndex: -1 }}
                />
              )}
              <Icon className={`text-base flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span className="flex-1">{label}</span>
              {label === 'Notifications' && unreadCount > 0 && (
                <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>

    {/* User card */}
    <div className="p-3 border-t border-white/5">
      <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0">
          {user?.avatar || user?.name?.[0] || 'A'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs font-bold truncate">{user?.name}</p>
          <p className="text-slate-500 text-[10px] truncate">{user?.email}</p>
        </div>
        <button onClick={onLogout} className="text-slate-500 hover:text-red-400 transition-colors" title="Logout" aria-label="Log out">
          <FaSignOutAlt />
        </button>
      </div>
    </div>
  </div>
);

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const unreadCount = getNotifications().filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-slate-900 flex-shrink-0">
        <SidebarContent unreadCount={unreadCount} user={user} onNavigate={() => setSidebarOpen(false)} onLogout={handleLogout} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-60 bg-slate-900 z-50 lg:hidden flex flex-col"
            >
              <SidebarContent unreadCount={unreadCount} user={user} onNavigate={() => setSidebarOpen(false)} onLogout={handleLogout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-6 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Open sidebar menu"
            >
              <FaBars />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <button
              onClick={() => navigate(ROUTES.ADMIN.NOTIFICATIONS)}
              className="relative p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
            >
              <FaBell />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Profile menu */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 hover:bg-slate-100 rounded-xl transition-colors"
                aria-haspopup="true"
                aria-expanded={profileMenuOpen}
                aria-label="Open profile menu"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white text-xs font-black">
                  {user?.avatar || user?.name?.[0] || 'A'}
                </div>
                <span className="text-sm font-semibold text-slate-700 hidden sm:block">{user?.name?.split(' ')[0]}</span>
                <FaChevronDown className="text-slate-400 text-xs" />
              </button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                      <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                    </div>
                    <button
                      onClick={() => { setProfileMenuOpen(false); navigate(ROUTES.ADMIN.SETTINGS); }}
                      className="w-full px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 text-left flex items-center gap-2"
                    >
                      <FaCog className="text-slate-400" /> Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left flex items-center gap-2"
                    >
                      <FaSignOutAlt className="text-red-400" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
