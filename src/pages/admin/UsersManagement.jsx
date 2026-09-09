import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaEye, FaBan, FaTrash, FaUsers } from 'react-icons/fa';
import { getUsers, updateUserStatus, deleteUser, getUserBookings } from '../../utils/dataStore';
import { ROLES } from '../../constants/roles';

const statusColors = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  blocked: 'bg-red-50 text-red-600 border-red-200',
};

const PER_PAGE = 8;

const getNonAdminUsers = () => getUsers().filter(u => u.role !== ROLES.ADMIN);

const UsersManagement = () => {
  const [users, setUsers] = useState(() => getNonAdminUsers());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [viewUser, setViewUser] = useState(null);
  const [userBookings, setUserBookings] = useState([]);

  const refresh = () => setUsers(getNonAdminUsers());

  const openView = (u) => {
    setViewUser(u);
    setUserBookings(getUserBookings(u.id));
  };

  const handleBlock = (id) => {
    const u = users.find(u => u.id === id);
    updateUserStatus(id, u.status === 'blocked' ? 'active' : 'blocked');
    refresh();
    if (viewUser?.id === id) setViewUser(v => ({ ...v, status: v.status === 'blocked' ? 'active' : 'blocked' }));
  };

  const handleDelete = (id) => {
    deleteUser(id);
    setViewUser(null);
    refresh();
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return (u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)) &&
      (statusFilter === 'All' || u.status === statusFilter);
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-slate-900 font-display">Users Management</h1>
        <p className="text-slate-500 text-sm mt-0.5">{users.length} registered customers</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input aria-label="Search users" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or email..." className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
        </div>
        <div className="flex gap-2">
          {['All', 'active', 'blocked'].map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={`px-3 py-2 rounded-xl text-xs font-bold border capitalize transition-colors ${statusFilter === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Phone</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Joined</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-violet-400 to-violet-600 rounded-xl text-white text-sm font-black flex items-center justify-center flex-shrink-0">
                        {u.avatar || u.name?.[0] || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-400 capitalize">{u.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 hidden md:table-cell">{u.email}</td>
                  <td className="px-5 py-4 text-sm text-slate-600 hidden lg:table-cell">{u.phone || '—'}</td>
                  <td className="px-5 py-4 text-sm text-slate-500 hidden lg:table-cell">{u.joinDate}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold border capitalize ${statusColors[u.status] || 'bg-slate-50 text-slate-500 border-slate-200'}`}>{u.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openView(u)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="View"><FaEye className="text-xs" /></button>
                      <button onClick={() => handleBlock(u.id)} className={`p-1.5 rounded-lg transition-colors ${u.status === 'blocked' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`} title={u.status === 'blocked' ? 'Unblock' : 'Block'}><FaBan className="text-xs" /></button>
                      <button onClick={() => handleDelete(u.id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors" title="Delete"><FaTrash className="text-xs" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <FaUsers className="text-4xl text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-semibold">No users found</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 disabled:opacity-40">Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-xl text-sm font-bold ${page === p ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 disabled:opacity-40">Next</button>
        </div>
      )}

      {/* View User Modal */}
      <AnimatePresence>
        {viewUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewUser(null)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-violet-600 to-violet-700 px-6 py-5 flex items-center justify-between rounded-t-3xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white font-black text-lg">{viewUser.avatar || viewUser.name?.[0]}</div>
                  <div>
                    <h2 className="text-white font-black text-lg">{viewUser.name}</h2>
                    <p className="text-violet-200 text-xs">{viewUser.email}</p>
                  </div>
                </div>
                <button onClick={() => setViewUser(null)} className="text-violet-200 hover:text-white p-2 hover:bg-white/10 rounded-xl">✕</button>
              </div>
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  {[['Phone', viewUser.phone || '—'], ['Joined', viewUser.joinDate], ['Status', viewUser.status], ['Role', viewUser.role]].map(([l, v]) => (
                    <div key={l} className="flex justify-between border-b border-slate-50 pb-2.5">
                      <span className="text-xs font-bold text-slate-400 uppercase">{l}</span>
                      <span className={`text-sm font-semibold capitalize ${l === 'Status' && viewUser.status === 'blocked' ? 'text-red-500' : 'text-slate-800'}`}>{v}</span>
                    </div>
                  ))}
                </div>

                <h3 className="font-bold text-slate-800 text-sm mb-3">Booking History ({userBookings.length})</h3>
                {userBookings.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {userBookings.map(b => (
                      <div key={b.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs">
                        <div>
                          <p className="font-bold text-slate-700">{b.carName}</p>
                          <p className="text-slate-400">{b.pickupDate} → {b.returnDate}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-lg font-bold border text-[10px] ${
                          b.status === 'Completed' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                          b.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>{b.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs text-center py-4">No bookings found.</p>
                )}

                <div className="flex gap-3 mt-6">
                  <button onClick={() => handleBlock(viewUser.id)} className={`flex-1 py-2.5 font-bold rounded-xl text-sm flex items-center justify-center gap-2 ${viewUser.status === 'blocked' ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-amber-500 text-white hover:bg-amber-600'}`}>
                    <FaBan /> {viewUser.status === 'blocked' ? 'Unblock' : 'Block'}
                  </button>
                  <button onClick={() => handleDelete(viewUser.id)} className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl text-sm hover:bg-red-600 flex items-center justify-center gap-2"><FaTrash /> Delete</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UsersManagement;
