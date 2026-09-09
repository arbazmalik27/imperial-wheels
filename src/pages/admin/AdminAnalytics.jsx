import { useState, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { FaChartLine, FaChartBar, FaChartPie, FaUsers, FaMoneyBillWave } from 'react-icons/fa';
import { getAnalyticsData, getBookings } from '../../utils/dataStore';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const CustomTooltip = ({ active, payload, label, prefix = '', suffix = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-xl">
        <p className="font-bold mb-1">{label}</p>
        {/* Recharts' payload array is freshly generated per hover and never reordered — index key is safe here. */}
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {prefix}{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}{suffix}</p>
        ))}
      </div>
    );
  }
  return null;
};

const AdminAnalytics = () => {
  const data = getAnalyticsData();
  const bookings = getBookings();
  const [activeChart, setActiveChart] = useState('revenue');

  const popularCars = useMemo(() => {
    const counts = {};
    bookings.forEach(b => { counts[b.carName] = (counts[b.carName] || 0) + 1; });
    return Object.entries(counts).map(([name, bookings]) => ({ name: name.split(' ').slice(0, 3).join(' '), bookings })).sort((a, b) => b.bookings - a.bookings).slice(0, 6);
  }, [bookings]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 font-display">Analytics & Reports</h1>
        <p className="text-slate-500 text-sm mt-0.5">Business performance insights and trends</p>
      </div>

      {/* Chart selector tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'revenue', label: 'Revenue', icon: FaMoneyBillWave },
          { key: 'bookings', label: 'Bookings', icon: FaChartLine },
          { key: 'users', label: 'User Growth', icon: FaUsers },
          { key: 'popular', label: 'Popular Cars', icon: FaChartBar },
          { key: 'category', label: 'Categories', icon: FaChartPie },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveChart(key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${activeChart === key ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
          >
            <Icon className="text-xs" /> {label}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Avg Monthly Revenue</p>
          <p className="text-2xl font-black text-slate-900">₹{Math.floor(data.revenue.reduce((a, b) => a + b.revenue, 0) / 12).toLocaleString()}</p>
          <p className="text-xs text-emerald-500 font-bold mt-1">+18% vs last year</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Total Bookings</p>
          <p className="text-2xl font-black text-slate-900">{data.bookings.reduce((a, b) => a + b.bookings, 0) + bookings.length}</p>
          <p className="text-xs text-blue-500 font-bold mt-1">+12% vs last year</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">User Growth</p>
          <p className="text-2xl font-black text-slate-900">+{data.users.reduce((a, b) => a + b.users, 0)}</p>
          <p className="text-xs text-violet-500 font-bold mt-1">+25% vs last year</p>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        {activeChart === 'revenue' && (
          <>
            <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2"><FaMoneyBillWave className="text-teal-500" /> Monthly Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={data.revenue}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip prefix="₹" />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 5, fill: '#3b82f6' }} />
              </AreaChart>
            </ResponsiveContainer>
          </>
        )}

        {activeChart === 'bookings' && (
          <>
            <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2"><FaChartLine className="text-blue-500" /> Monthly Booking Trend</h2>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data.bookings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="bookings" name="Bookings" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

        {activeChart === 'users' && (
          <>
            <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2"><FaUsers className="text-violet-500" /> User Growth</h2>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={data.users}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="users" name="New Users" stroke="#8b5cf6" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#8b5cf6' }} />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}

        {activeChart === 'popular' && (
          <>
            <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2"><FaChartBar className="text-amber-500" /> Most Booked Cars</h2>
            {popularCars.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={popularCars} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={120} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="bookings" name="Bookings" fill="#f59e0b" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-400">No booking data yet.</div>
            )}
          </>
        )}

        {activeChart === 'category' && (
          <>
            <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2"><FaChartPie className="text-pink-500" /> Vehicle Category Distribution</h2>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={data.categories} cx="50%" cy="50%" innerRadius={70} outerRadius={120} paddingAngle={3} dataKey="value">
                    {data.categories.map((entry, i) => <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 flex-shrink-0">
                {data.categories.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-sm text-slate-700 font-semibold">{c.name}</span>
                    <span className="text-sm text-slate-400 font-bold">{c.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
