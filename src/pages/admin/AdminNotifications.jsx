import { useState } from 'react';
import { getNotifications, markNotificationRead, markAllNotificationsRead, clearNotifications } from '../../utils/dataStore';
import { FaBell, FaCheck, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const typeColors = {
  booking: 'bg-blue-100 text-blue-600',
  sell: 'bg-pink-100 text-pink-600',
  contact: 'bg-violet-100 text-violet-600',
  user: 'bg-emerald-100 text-emerald-600',
};

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState(() => getNotifications());
  const [filter, setFilter] = useState('All');

  const refresh = () => setNotifications(getNotifications());

  const handleMarkRead = (id) => { markNotificationRead(id); refresh(); };
  const handleMarkAll = () => { markAllNotificationsRead(); refresh(); };
  const handleClear = () => { clearNotifications(); refresh(); };

  const filtered = filter === 'All' ? notifications : notifications.filter(n => n.category === filter);
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">Notifications</h1>
          <p className="text-slate-500 text-sm mt-0.5">{unread} unread · {notifications.length} total</p>
        </div>
        <div className="flex gap-2">
          {unread > 0 && (
            <button onClick={handleMarkAll} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700">
              <FaCheck className="text-xs" /> Mark All Read
            </button>
          )}
          {notifications.length > 0 && (
            <button onClick={handleClear} className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-bold hover:bg-red-100">
              <FaTrash className="text-xs" /> Clear All
            </button>
          )}
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap">
        {['All', 'Booking', 'Sell Request', 'Contact', 'User'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${filter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>{f}</button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.map(n => (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className={`bg-white rounded-2xl border p-4 flex items-start gap-4 transition-colors ${!n.read ? 'border-blue-200 bg-blue-50/30' : 'border-slate-100'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${typeColors[n.type] || 'bg-slate-100 text-slate-600'}`}>
                {n.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColors[n.type] || 'bg-slate-100 text-slate-600'}`}>{n.category}</span>
                    <p className="text-sm font-semibold text-slate-800 mt-1 leading-relaxed">{n.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{new Date(n.time).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                    {!n.read && (
                      <button onClick={() => handleMarkRead(n.id)} className="p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition-colors" title="Mark Read">
                        <FaCheck className="text-xs" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-100">
            <FaBell className="text-5xl text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-semibold">No notifications</p>
            <p className="text-slate-400 text-sm mt-1">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
