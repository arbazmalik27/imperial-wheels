import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaEye, FaCheck, FaTimes, FaCalendarAlt, FaTrash } from 'react-icons/fa';
import { getBookings, updateBookingStatus, deleteBooking, seedInitialData } from '../../utils/dataStore';

const statusColors = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Approved: 'bg-blue-50 text-blue-700 border-blue-200',
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Completed: 'bg-slate-100 text-slate-600 border-slate-200',
  Cancelled: 'bg-red-50 text-red-600 border-red-200',
};

const STATUSES = ['All', 'Pending', 'Approved', 'Active', 'Completed', 'Cancelled'];
const PER_PAGE = 8;

const BookingsManagement = () => {
  const [bookings, setBookings] = useState(() => { seedInitialData(); return getBookings(); });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [viewBooking, setViewBooking] = useState(null);

  const refresh = () => setBookings(getBookings());

  const handleStatus = (id, status) => {
    updateBookingStatus(id, status);
    refresh();
    if (viewBooking?.id === id) setViewBooking(b => ({ ...b, status }));
  };

  const handleDelete = (id) => {
    deleteBooking(id);
    setViewBooking(null);
    refresh();
  };

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = b.customerName?.toLowerCase().includes(q) || b.carName?.toLowerCase().includes(q) || b.id?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">Bookings Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">{bookings.length} total bookings · {bookings.filter(b => b.status === 'Pending').length} pending</p>
        </div>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Pending', count: bookings.filter(b => b.status === 'Pending').length, color: 'bg-amber-500' },
          { label: 'Approved', count: bookings.filter(b => b.status === 'Approved').length, color: 'bg-blue-500' },
          { label: 'Active', count: bookings.filter(b => b.status === 'Active').length, color: 'bg-emerald-500' },
          { label: 'Completed', count: bookings.filter(b => b.status === 'Completed').length, color: 'bg-slate-500' },
          { label: 'Cancelled', count: bookings.filter(b => b.status === 'Cancelled').length, color: 'bg-red-500' },
        ].map(({ label, count, color }) => (
          <button
            key={label}
            onClick={() => { setStatusFilter(label); setPage(1); }}
            className={`bg-white rounded-2xl border p-4 text-left hover:shadow-md transition-shadow ${statusFilter === label ? 'border-blue-400 shadow-md' : 'border-slate-100'}`}
          >
            <div className={`w-8 h-8 ${color} rounded-xl mb-2 flex items-center justify-center`}>
              <span className="text-white font-black text-sm">{count}</span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            aria-label="Search bookings"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by customer name, car, or booking ID..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
        >
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Booking ID</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">Car</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Pickup</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Return</th>
                <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.map(b => (
                <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-xs font-mono font-bold text-blue-600">{b.id}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-violet-600 rounded-lg text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                        {b.customerName?.[0] || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 whitespace-nowrap">{b.customerName}</p>
                        <p className="text-xs text-slate-400">{b.customerEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <p className="text-sm font-semibold text-slate-700 whitespace-nowrap max-w-36 truncate">{b.carName}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500 hidden lg:table-cell whitespace-nowrap">{b.pickupDate}</td>
                  <td className="px-5 py-4 text-sm text-slate-500 hidden lg:table-cell whitespace-nowrap">{b.returnDate}</td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm font-bold text-slate-900 whitespace-nowrap">₹{(b.totalPrice || 0).toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${statusColors[b.status] || statusColors.Pending}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setViewBooking(b)}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        title="View"
                      >
                        <FaEye className="text-xs" />
                      </button>
                      {b.status === 'Pending' && (
                        <>
                          <button onClick={() => handleStatus(b.id, 'Approved')} className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors" title="Approve"><FaCheck className="text-xs" /></button>
                          <button onClick={() => handleStatus(b.id, 'Cancelled')} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors" title="Reject"><FaTimes className="text-xs" /></button>
                        </>
                      )}
                      {b.status === 'Approved' && (
                        <button onClick={() => handleStatus(b.id, 'Active')} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-100">Activate</button>
                      )}
                      {b.status === 'Active' && (
                        <button onClick={() => handleStatus(b.id, 'Completed')} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200">Complete</button>
                      )}
                      <button
                        onClick={() => { if (window.confirm('Are you sure you want to delete this booking?')) handleDelete(b.id); }}
                        className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-400">
            <FaCalendarAlt className="text-4xl text-slate-200 mx-auto mb-3" />
            <p className="font-semibold">No bookings found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 disabled:opacity-40 hover:bg-slate-50">Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-xl text-sm font-bold ${page === p ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 disabled:opacity-40 hover:bg-slate-50">Next</button>
        </div>
      )}

      {/* View Booking Modal */}
      <AnimatePresence>
        {viewBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewBooking(null)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-xs font-bold uppercase tracking-wider">Booking Details</p>
                    <h2 className="text-white font-black text-xl mt-1">{viewBooking.id}</h2>
                  </div>
                  <button onClick={() => setViewBooking(null)} className="text-blue-200 hover:text-white p-2 hover:bg-white/10 rounded-xl"><FaTimes /></button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {[
                  ['Customer', viewBooking.customerName],
                  ['Email', viewBooking.customerEmail],
                  ['Phone', viewBooking.phone],
                  ['Car', viewBooking.carName],
                  ['Pickup Date', viewBooking.pickupDate],
                  ['Return Date', viewBooking.returnDate],
                  ['Pickup Location', viewBooking.pickupLocation],
                  ['Total Price', `₹${(viewBooking.totalPrice || 0).toLocaleString()}`],
                  ['Notes', viewBooking.notes],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={label} className="flex justify-between items-start gap-4 border-b border-slate-50 pb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">{label}</span>
                    <span className="text-sm font-semibold text-slate-800 text-right">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</span>
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${statusColors[viewBooking.status]}`}>{viewBooking.status}</span>
                </div>
                <div className="flex gap-3 mt-2 pt-2">
                  {viewBooking.status === 'Pending' && <>
                    <button onClick={() => handleStatus(viewBooking.id, 'Approved')} className="flex-1 py-2.5 bg-emerald-500 text-white font-bold rounded-xl text-sm hover:bg-emerald-600 flex items-center justify-center gap-2"><FaCheck /> Approve</button>
                    <button onClick={() => handleStatus(viewBooking.id, 'Cancelled')} className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl text-sm hover:bg-red-600 flex items-center justify-center gap-2"><FaTimes /> Reject</button>
                  </>}
                  {viewBooking.status === 'Approved' && <button onClick={() => handleStatus(viewBooking.id, 'Active')} className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700">Mark Active</button>}
                  {viewBooking.status === 'Active' && <button onClick={() => handleStatus(viewBooking.id, 'Completed')} className="flex-1 py-2.5 bg-slate-700 text-white font-bold rounded-xl text-sm hover:bg-slate-800">Mark Completed</button>}
                  <button
                    onClick={() => { if (window.confirm('Are you sure you want to delete this booking?')) handleDelete(viewBooking.id); }}
                    className="py-2.5 px-4 bg-red-500 text-white font-bold rounded-xl text-sm hover:bg-red-600 flex items-center justify-center gap-2"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingsManagement;
