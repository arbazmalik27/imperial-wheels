import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaEye, FaCheck, FaTimes, FaClipboardList } from 'react-icons/fa';
import { getSellRequests, updateSellRequestStatus, seedInitialData } from '../../utils/dataStore';

const statusColors = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-red-50 text-red-600 border-red-200',
};

const PER_PAGE = 8;

const SellRequests = () => {
  const [requests, setRequests] = useState(() => { seedInitialData(); return getSellRequests(); });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [viewItem, setViewItem] = useState(null);

  const refresh = () => setRequests(getSellRequests());

  const handleStatus = (id, status) => {
    updateSellRequestStatus(id, status);
    refresh();
    if (viewItem?.id === id) setViewItem(r => ({ ...r, status }));
  };

  const filtered = requests.filter(r => {
    const q = search.toLowerCase();
    const match = r.sellerName?.toLowerCase().includes(q) || r.brand?.toLowerCase().includes(q) || r.model?.toLowerCase().includes(q) || r.id?.toLowerCase().includes(q);
    return match && (statusFilter === 'All' || r.status === statusFilter);
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-slate-900 font-display">Sell Requests</h1>
        <p className="text-slate-500 text-sm mt-0.5">{requests.length} total · {requests.filter(r => r.status === 'Pending').length} pending review</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input aria-label="Search sell requests" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by seller name, brand, or model..." className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
        </div>
        <div className="flex gap-2">
          {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${statusFilter === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">ID</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Seller</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">Vehicle</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Year</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Mileage</th>
                <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Price</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4"><span className="text-xs font-mono font-bold text-pink-600">{r.id}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg text-white text-xs font-black flex items-center justify-center">{r.sellerName?.[0] || '?'}</div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 whitespace-nowrap">{r.sellerName}</p>
                        <p className="text-xs text-slate-400">{r.sellerEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell"><p className="text-sm font-semibold text-slate-700">{r.brand} {r.model}</p></td>
                  <td className="px-5 py-4 text-sm text-slate-500 hidden lg:table-cell">{r.year}</td>
                  <td className="px-5 py-4 text-sm text-slate-500 hidden lg:table-cell">{parseInt(r.mileage || 0).toLocaleString()} mi</td>
                  <td className="px-5 py-4 text-right"><span className="text-sm font-bold text-slate-900">₹{parseInt(r.price || 0).toLocaleString()}</span></td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${statusColors[r.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>{r.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setViewItem(r)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" title="View"><FaEye className="text-xs" /></button>
                      {r.status === 'Pending' && (
                        <>
                          <button onClick={() => handleStatus(r.id, 'Approved')} className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100" title="Approve"><FaCheck className="text-xs" /></button>
                          <button onClick={() => handleStatus(r.id, 'Rejected')} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100" title="Reject"><FaTimes className="text-xs" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <FaClipboardList className="text-4xl text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-semibold">No sell requests found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 disabled:opacity-40">Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-xl text-sm font-bold ${page === p ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 disabled:opacity-40">Next</button>
        </div>
      )}

      {/* View Modal */}
      <AnimatePresence>
        {viewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewItem(null)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="bg-gradient-to-r from-pink-600 to-pink-700 px-6 py-5 flex items-center justify-between">
                <div>
                  <p className="text-pink-200 text-xs font-bold uppercase tracking-wider">Sell Request</p>
                  <h2 className="text-white font-black text-xl mt-1">{viewItem.id}</h2>
                </div>
                <button onClick={() => setViewItem(null)} className="text-pink-200 hover:text-white p-2 hover:bg-white/10 rounded-xl"><FaTimes /></button>
              </div>
              <div className="p-6 space-y-3">
                {[
                  ['Seller', viewItem.sellerName],
                  ['Email', viewItem.sellerEmail],
                  ['Phone', viewItem.sellerPhone],
                  ['Vehicle', `${viewItem.year} ${viewItem.brand} ${viewItem.model}`],
                  ['Mileage', `${parseInt(viewItem.mileage || 0).toLocaleString()} miles`],
                  ['Condition', viewItem.condition],
                  ['Expected Price', `₹${parseInt(viewItem.price || 0).toLocaleString()}`],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-slate-50 pb-2.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
                    <span className="text-sm font-semibold text-slate-800">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</span>
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${statusColors[viewItem.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>{viewItem.status}</span>
                </div>
                {viewItem.status === 'Pending' && (
                  <div className="flex gap-3 mt-3 pt-2">
                    <button onClick={() => handleStatus(viewItem.id, 'Approved')} className="flex-1 py-2.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 flex items-center justify-center gap-2"><FaCheck /> Approve</button>
                    <button onClick={() => handleStatus(viewItem.id, 'Rejected')} className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 flex items-center justify-center gap-2"><FaTimes /> Reject</button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SellRequests;
