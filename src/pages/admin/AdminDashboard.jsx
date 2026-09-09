import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaCar, FaUsers, FaCalendarCheck, FaMoneyBillWave, FaClipboardList,
  FaArrowUp, FaArrowDown, FaCheck, FaTimes,
  FaBell, FaPlus
} from 'react-icons/fa';
import { getBookings, getSellRequests, getUsers, getNotifications, updateBookingStatus, getAnalyticsData, seedInitialData, getCars } from '../../utils/dataStore';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

// KPI Card component
const KpiCard = ({ title, value, icon: Icon, color, trend, trendUp, sparkData, prefix = '', suffix = '' }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
        <p className="text-2xl font-black text-slate-900 font-display">{prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}</p>
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="text-lg text-white" />
      </div>
    </div>
    {sparkData && (
      <ResponsiveContainer width="100%" height={40}>
        <AreaChart data={sparkData}>
          <Area type="monotone" dataKey="v" stroke={trendUp ? '#3b82f6' : '#f59e0b'} fill={trendUp ? '#dbeafe' : '#fef3c7'} strokeWidth={2} dot={false} />
          <Tooltip hide />
        </AreaChart>
      </ResponsiveContainer>
    )}
    <div className="flex items-center gap-1 mt-2">
      {trendUp ? <FaArrowUp className="text-emerald-500 text-xs" /> : <FaArrowDown className="text-red-400 text-xs" />}
      <span className={`text-xs font-bold ${trendUp ? 'text-emerald-500' : 'text-red-400'}`}>{trend}</span>
      <span className="text-xs text-slate-400">vs last month</span>
    </div>
  </motion.div>
);

const statusColors = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Approved: 'bg-blue-50 text-blue-700 border-blue-200',
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Completed: 'bg-slate-50 text-slate-600 border-slate-200',
  Cancelled: 'bg-red-50 text-red-600 border-red-200',
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(() => { seedInitialData(); return getBookings(); });
  const [sellRequests] = useState(() => getSellRequests());
  const [notifications] = useState(() => getNotifications());
  const [cars, setCars] = useState(() => getCars());
  const [users, setUsers] = useState(() => getUsers());
  const analyticsData = getAnalyticsData();

  const refreshBookings = () => {
    setBookings(getBookings());
    setCars(getCars());
    setUsers(getUsers());
  };

  const handleStatusChange = (id, status) => {
    updateBookingStatus(id, status);
    refreshBookings();
  };

  const customers = users.filter(u => u.role === 'customer');
  const activeRentals = bookings.filter(b => b.status === 'Active').length;
  const completedRentals = bookings.filter(b => b.status === 'Completed').length;
  const totalRevenue = bookings.filter(b => b.status === 'Completed').reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const unreadNotifs = notifications.filter(n => !n.read).length;

  // Monthly breakdown for active and completed rentals to populate sparklines
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const activeByMonth = {};
  const completedByMonth = {};
  months.forEach(m => {
    activeByMonth[m] = 0;
    completedByMonth[m] = 0;
  });

  bookings.forEach(b => {
    const dateStr = b.createdAt || b.pickupDate;
    if (dateStr) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        const mName = months[date.getMonth()];
        if (b.status === 'Active') activeByMonth[mName]++;
        if (b.status === 'Completed') completedByMonth[mName]++;
      }
    }
  });

  const getTrend = (monthlyData) => {
    const currentMonthIndex = new Date().getMonth();
    const prevMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
    const curVal = monthlyData[currentMonthIndex]?.value || 0;
    const prevVal = monthlyData[prevMonthIndex]?.value || 0;
    if (prevVal === 0) {
      if (curVal === 0) return { percent: '0%', up: true };
      return { percent: `+${curVal * 100}%`, up: true };
    }
    const pct = ((curVal - prevVal) / prevVal) * 100;
    return { percent: `${pct >= 0 ? '+' : ''}${pct.toFixed(0)}%`, up: pct >= 0 };
  };

  const revenueTrend = getTrend(analyticsData.revenue.map(r => ({ month: r.month, value: r.revenue })));
  const bookingsTrend = getTrend(analyticsData.bookings.map(b => ({ month: b.month, value: b.bookings })));
  const customersTrend = getTrend(analyticsData.users.map(u => ({ month: u.month, value: u.users })));
  const activeTrend = getTrend(months.map(m => ({ month: m, value: activeByMonth[m] })));
  const completedTrend = getTrend(months.map(m => ({ month: m, value: completedByMonth[m] })));

  const sparkRevenue = analyticsData.revenue.slice(-7).map(d => ({ v: d.revenue }));
  const sparkBookings = analyticsData.bookings.slice(-7).map(d => ({ v: d.bookings }));
  const sparkUsers = analyticsData.users.slice(-7).map(d => ({ v: d.users }));
  const sparkActive = months.slice(-7).map(m => ({ v: activeByMonth[m] }));
  const sparkCompleted = months.slice(-7).map(m => ({ v: completedByMonth[m] }));

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-0.5">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          {unreadNotifs > 0 && (
            <button
              onClick={() => navigate('/admin/notifications')}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
            >
              <FaBell /> {unreadNotifs} New Alerts
            </button>
          )}
          <button
            onClick={() => navigate('/admin/cars')}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
          >
            <FaPlus /> Add Car
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
        <KpiCard title="Total Cars" value={cars.length} icon={FaCar} color="bg-blue-600" trend="+0%" trendUp sparkData={[{v:cars.length},{v:cars.length},{v:cars.length},{v:cars.length}]} />
        <KpiCard title="Total Customers" value={customers.length} icon={FaUsers} color="bg-violet-600" trend={customersTrend.percent} trendUp={customersTrend.up} sparkData={sparkUsers} />
        <KpiCard title="Total Bookings" value={bookings.length} icon={FaClipboardList} color="bg-pink-600" trend={bookingsTrend.percent} trendUp={bookingsTrend.up} sparkData={sparkBookings} />
        <KpiCard title="Active Bookings" value={activeRentals} icon={FaCalendarCheck} color="bg-emerald-600" trend={activeTrend.percent} trendUp={activeTrend.up} sparkData={sparkActive} />
        <KpiCard title="Completed Bookings" value={completedRentals} icon={FaCheck} color="bg-slate-600" trend={completedTrend.percent} trendUp={completedTrend.up} sparkData={sparkCompleted} />
        <KpiCard title="Total Revenue" value={Math.floor(totalRevenue / 1000)} prefix="₹" suffix="K" icon={FaMoneyBillWave} color="bg-teal-600" trend={revenueTrend.percent} trendUp={revenueTrend.up} sparkData={sparkRevenue} />
      </div>

      {/* Recent Bookings + Quick Stats */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Bookings Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FaCalendarCheck className="text-blue-600" /> Recent Bookings
            </h2>
            <Link to="/admin/bookings" className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1">
              View All <FaArrowUp className="rotate-45" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">Vehicle</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Pickup</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Return</th>
                  <th className="text-right px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {bookings.slice(0, 5).map(b => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                          {b.customerName?.[0] || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 whitespace-nowrap">{b.customerName}</p>
                          <p className="text-xs text-slate-400">{b.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-sm font-semibold text-slate-700 whitespace-nowrap">{b.carName}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 hidden lg:table-cell whitespace-nowrap">{b.pickupDate}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 hidden lg:table-cell whitespace-nowrap">{b.returnDate}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-slate-900 whitespace-nowrap">₹{(b.totalPrice || 0).toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${statusColors[b.status] || statusColors.Pending}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {b.status === 'Pending' && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleStatusChange(b.id, 'Approved')}
                            className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                            title="Approve"
                          >
                            <FaCheck className="text-xs" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(b.id, 'Cancelled')}
                            className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                            title="Cancel"
                          >
                            <FaTimes className="text-xs" />
                          </button>
                        </div>
                      )}
                      {b.status === 'Approved' && (
                        <button
                          onClick={() => handleStatusChange(b.id, 'Active')}
                          className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-100"
                        >
                          Activate
                        </button>
                      )}
                      {b.status === 'Active' && (
                        <button
                          onClick={() => handleStatusChange(b.id, 'Completed')}
                          className="px-2 py-1 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-100"
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-sm">No bookings yet.</div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">
          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FaBell className="text-amber-500" /> Notifications
                {unreadNotifs > 0 && (
                  <span className="w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">{unreadNotifs}</span>
                )}
              </h2>
              <Link to="/admin/notifications" className="text-blue-600 text-xs font-bold hover:underline">All</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {notifications.slice(0, 5).map(n => (
                <div key={n.id} className={`flex items-start gap-3 px-5 py-3 ${!n.read ? 'bg-blue-50/30' : ''}`}>
                  <span className="text-lg">{n.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{new Date(n.time).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</p>
                  </div>
                  {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0" />}
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs">No notifications.</div>
              )}
            </div>
          </div>

          {/* Sell Requests */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FaClipboardList className="text-pink-500" /> Sell Requests
              </h2>
              <Link to="/admin/sell-requests" className="text-blue-600 text-xs font-bold hover:underline">All</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {sellRequests.slice(0, 3).map(r => (
                <div key={r.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{r.year} {r.brand} {r.model}</p>
                    <p className="text-[10px] text-slate-400">{r.sellerName} • ₹{parseInt(r.price || 0).toLocaleString()}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${statusColors[r.status] || 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                    {r.status}
                  </span>
                </div>
              ))}
              {sellRequests.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs">No sell requests.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
