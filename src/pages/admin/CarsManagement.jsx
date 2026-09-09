import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch, FaPlus, FaEdit, FaTrash, FaStar,
  FaTimes, FaCarSide, FaGasPump, FaCog, FaUsers
} from 'react-icons/fa';
import { getCars, addCar, updateCar, deleteCar } from '../../utils/dataStore';

const CAR_STATUSES = ['Available', 'Booked', 'Under Maintenance', 'Sold'];
const CAR_CATEGORIES = ['Sports', 'SUV', 'Electric', 'Luxury', 'Convertible', 'Supercar', 'Muscle', 'Offroad', 'Wagon'];

const statusColors = {
  Available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Booked: 'bg-blue-50 text-blue-700 border-blue-200',
  'Under Maintenance': 'bg-amber-50 text-amber-700 border-amber-200',
  Sold: 'bg-slate-100 text-slate-600 border-slate-200',
};

const emptyForm = {
  name: '', brand: '', category: 'Sports', pricePerDay: '', seats: 4,
  fuel: 'Petrol', transmission: 'Automatic', engine: '', power: '',
  acceleration: '', description: '',
  images: ['https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80'],
  features: [],
  status: 'Available', featured: false,
};

const CarsManagement = () => {
  const [cars, setCarsState] = useState(() => getCars());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [featureInput, setFeatureInput] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const refresh = () => setCarsState(getCars() || []);

  const openAdd = () => { setForm(emptyForm); setEditingCar(null); setShowModal(true); };
  const openEdit = (car) => { setForm({ ...car }); setEditingCar(car.id); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditingCar(null); setForm(emptyForm); };

  const handleFormChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCar) {
      updateCar(editingCar, { ...form });
    } else {
      addCar({ ...form });
    }
    refresh();
    closeModal();
  };

  const handleDelete = (id) => {
    deleteCar(id);
    setDeleteConfirm(null);
    refresh();
  };

  const toggleFeatured = (id) => {
    const car = cars.find(c => c.id === id);
    updateCar(id, { featured: !car.featured });
    refresh();
  };

  const changeStatus = (id, status) => {
    updateCar(id, { status });
    refresh();
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setForm(f => ({ ...f, features: [...(f.features || []), featureInput.trim()] }));
      setFeatureInput('');
    }
  };
  const removeFeature = (i) => setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));

  const filtered = cars.filter(c => {
    const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase()) || c.brand?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">Cars Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">{cars.length} total vehicles in inventory</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
        >
          <FaPlus /> Add New Car
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            aria-label="Search cars"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search cars by name or brand..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', ...CAR_STATUSES].map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${statusFilter === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginated.map(car => (
          <motion.div
            key={car.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
          >
            <div className="relative h-40 bg-slate-100">
              <img
                src={car.images?.[0] || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=400&q=60'}
                alt={car.name}
                className="w-full h-full object-cover"
                onError={e => e.target.src = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=400&q=60'}
              />
              <div className="absolute top-2 left-2">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${statusColors[car.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {car.status}
                </span>
              </div>
              {car.featured && (
                <div className="absolute top-2 right-2">
                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-amber-400 text-white flex items-center gap-1">
                    <FaStar className="text-[8px]" /> Featured
                  </span>
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{car.category}</p>
              <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-1 mb-1">{car.name}</h3>
              <div className="flex gap-2 text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1"><FaUsers /> {car.seats}s</span>
                <span className="flex items-center gap-1"><FaGasPump /> {car.fuel}</span>
                <span className="flex items-center gap-1"><FaCog /> {car.transmission}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">Daily Rate</p>
                  <p className="font-black text-slate-900 text-sm">₹{(car.pricePerDay || 0).toLocaleString()}</p>
                </div>
                <select
                  value={car.status}
                  onChange={e => changeStatus(car.id, e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  {CAR_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleFeatured(car.id)}
                  className={`p-2 rounded-lg border transition-colors ${car.featured ? 'bg-amber-50 text-amber-500 border-amber-200' : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-amber-50 hover:text-amber-400'}`}
                  title="Toggle Featured"
                >
                  <FaStar className="text-xs" />
                </button>
                <button
                  onClick={() => openEdit(car)}
                  className="flex-1 py-2 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-xs font-bold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors flex items-center justify-center gap-1"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(car.id)}
                  className="p-2 bg-slate-50 text-slate-400 border border-slate-200 rounded-lg hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                  title="Delete"
                >
                  <FaTrash className="text-xs" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-100">
          <FaCarSide className="text-5xl text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 font-semibold">No cars found</p>
          <p className="text-slate-400 text-sm mt-1">Try changing your search or filters.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 disabled:opacity-40 hover:bg-slate-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-sm font-bold transition-colors ${page === p ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 disabled:opacity-40 hover:bg-slate-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
                <h2 className="font-bold text-slate-900 text-lg">{editingCar ? 'Edit Car' : 'Add New Car'}</h2>
                <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Car Name', name: 'name', placeholder: 'e.g. Porsche 911 Carrera S' },
                    { label: 'Brand', name: 'brand', placeholder: 'e.g. Porsche' },
                    { label: 'Engine', name: 'engine', placeholder: 'e.g. 3.0L Twin-Turbo' },
                    { label: 'Power', name: 'power', placeholder: 'e.g. 443 HP' },
                    { label: 'Acceleration', name: 'acceleration', placeholder: 'e.g. 3.5s (0-60 mph)' },
                    { label: 'Price Per Day (₹)', name: 'pricePerDay', type: 'number', placeholder: '35000' },
                    { label: 'Seats', name: 'seats', type: 'number', placeholder: '4' },
                  ].map(f => (
                    <div key={f.name}>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{f.label}</label>
                      <input
                        required={['name','brand','pricePerDay'].includes(f.name)}
                        type={f.type || 'text'}
                        name={f.name}
                        value={form[f.name] || ''}
                        onChange={handleFormChange}
                        placeholder={f.placeholder}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                    <select name="category" value={form.category} onChange={handleFormChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
                      {CAR_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Fuel Type</label>
                    <select name="fuel" value={form.fuel} onChange={handleFormChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
                      {['Petrol','Electric','Hybrid','Diesel'].map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Transmission</label>
                    <select name="transmission" value={form.transmission} onChange={handleFormChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
                      {['Automatic','Manual'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                    <select name="status" value={form.status} onChange={handleFormChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
                      {CAR_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Image URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={form.images?.[0] || ''}
                    onChange={e => setForm(f => ({ ...f, images: [e.target.value] }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea
                    name="description"
                    value={form.description || ''}
                    onChange={handleFormChange}
                    rows={3}
                    placeholder="Describe this car..."
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                  />
                </div>

                {/* Features */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Features</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={e => setFeatureInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      placeholder="Add feature and press Enter"
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button type="button" onClick={addFeature} className="px-3 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700">
                      <FaPlus />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(form.features || []).map((feat, i) => (
                      <span key={feat} className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold">
                        {feat}
                        <button type="button" onClick={() => removeFeature(i)} className="text-blue-400 hover:text-red-500">
                          <FaTimes className="text-[9px]" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Featured toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={form.featured || false}
                    onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                    className="w-4 h-4 accent-blue-600 rounded"
                  />
                  <label htmlFor="featured" className="text-sm font-semibold text-slate-700">Mark as Featured</label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={closeModal} className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md">
                    {editingCar ? 'Save Changes' : 'Add Car'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirm(null)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center">
              <div className="w-14 h-14 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaTrash className="text-xl" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Delete Car?</h3>
              <p className="text-slate-500 text-sm mb-6">This action is permanent and will remove the car from all listings.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 border border-slate-200 font-bold rounded-xl text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-md">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarsManagement;
