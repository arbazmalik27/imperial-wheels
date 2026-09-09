import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaPhone, FaEnvelope, FaCalendarAlt, FaCar, FaCheckCircle, FaChevronRight, FaSignOutAlt, FaSave, FaExclamationCircle } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { getUserBookings, getUsers } from '../utils/dataStore';
import { ROUTES } from '../constants/routes';
import { usePageMeta } from '../hooks/usePageMeta';

const statusBadges = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Approved: 'bg-blue-50 text-blue-700 border-blue-200',
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Completed: 'bg-slate-50 text-slate-600 border-slate-200',
  Cancelled: 'bg-red-50 text-red-600 border-red-200',
};

const Profile = () => {
  usePageMeta('My Profile | Imperial Wheels');

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(() => user?.name || '');
  const [phone, setPhone] = useState(() => user?.phone || '');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  // Derived, not fetched: reading from localStorage here is synchronous, so
  // there's nothing to "synchronize" via an effect — just recompute when the
  // user changes.
  const bookings = useMemo(() => {
    if (!user) return [];
    const userBookings = getUserBookings(user.id);
    if (userBookings.length > 0) return userBookings;
    // Fallback if userId doesn't match: search by email instead
    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    return allBookings.filter(b => b.customerEmail === user.email || b.userId === user.id);
  }, [user]);

  useEffect(() => {
    if (!user) navigate(ROUTES.LOGIN);
  }, [user, navigate]);

  if (!user) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }
    
    try {
      // Update in localStorage 'users' array
      const users = getUsers();
      const updatedUsers = users.map(u => {
        if (u.id === user.id) {
          return { ...u, name, phone };
        }
        return u;
      });
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Update in 'currentUser'
      const updatedUser = { ...user, name, phone };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update state/auth context by refreshing page or manually reloading (simplest is page reload or updating context)
      // Since context is loaded from localStorage, we can update currentUser in localStorage and trigger context sync
      // We can also trigger a window reload to refresh the context state safely
      setSaveSuccess(true);
      setError('');
      setIsEditing(false);
      
      setTimeout(() => {
        setSaveSuccess(false);
        window.location.reload();
      }, 1000);
    } catch (_err) {
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page title */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 font-display">My Account</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your profile details and view your rental history.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Overview Card */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 text-white font-black text-3xl rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/20 mb-6">
                  {user.avatar || user.name?.[0] || 'U'}
                </div>
                
                <h2 className="text-xl font-extrabold text-slate-800 font-display">{user.name}</h2>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider mt-2">
                  {user.role}
                </span>

                <div className="w-full border-t border-slate-100 my-6" />

                {/* Details List */}
                <div className="w-full space-y-4 text-left">
                  <div className="flex items-center gap-3 text-slate-600">
                    <FaEnvelope className="text-slate-400 text-sm flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</p>
                      <p className="text-sm font-semibold text-slate-800 truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-600">
                    <FaPhone className="text-slate-400 text-sm flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone Number</p>
                      <p className="text-sm font-semibold text-slate-800 truncate">{user.phone || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-600">
                    <FaCalendarAlt className="text-slate-400 text-sm flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Joined On</p>
                      <p className="text-sm font-semibold text-slate-800 truncate">{user.joinDate || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="w-full border-t border-slate-100 my-6" />

                <div className="w-full flex flex-col gap-3">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaUser className="text-xs" /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm rounded-xl border border-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaSignOutAlt className="text-xs" /> Log Out
                  </button>
                </div>
              </div>
            </div>

            {/* Editing Form Modal/Panel */}
            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm overflow-hidden"
                >
                  <h3 className="text-base font-extrabold text-slate-800 font-display mb-4">Edit Information</h3>
                  <form onSubmit={handleSave} className="space-y-4">
                    {error && (
                      <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs flex items-center gap-2">
                        <FaExclamationCircle /> {error}
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                    >
                      <FaSave /> Save Changes
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Save Success Alert */}
            <AnimatePresence>
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl p-4 text-sm font-bold flex items-center gap-2 justify-center shadow-sm"
                >
                  <FaCheckCircle className="text-base" /> Profile updated successfully!
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Booking History Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
              <h3 className="text-xl font-extrabold text-slate-800 font-display mb-6 flex items-center gap-2">
                <FaCar className="text-blue-600" /> My Booking History
              </h3>

              <div className="space-y-6">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="group border border-slate-100 rounded-2xl p-6 hover:border-blue-100 hover:shadow-md transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Diagonal accent line */}
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          {/* Car Icon Box */}
                          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FaCar className="text-lg" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <h4 className="text-base font-extrabold text-slate-800 font-display">{booking.carName}</h4>
                              <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${statusBadges[booking.status] || 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                {booking.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 font-semibold">Booking ID: {booking.id}</p>
                            
                            {/* Dates details */}
                            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 flex-wrap">
                              <div>
                                <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">Pickup Date</span>
                                <span className="font-bold text-slate-700">{booking.pickupDate}</span>
                              </div>
                              <FaChevronRight className="text-slate-300 self-end mb-0.5 hidden sm:block" />
                              <div>
                                <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">Return Date</span>
                                <span className="font-bold text-slate-700">{booking.returnDate}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Price Details */}
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t border-slate-50 md:border-t-0 pt-3 md:pt-0">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Amount</span>
                          <span className="text-lg font-black text-slate-900 font-display">₹{(booking.totalPrice || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl">
                    <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FaCar className="text-lg" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">No bookings found</h4>
                    <p className="text-xs text-slate-400 mt-1 mb-4">You have not booked any cars yet.</p>
                    <Link
                      to="/rent"
                      className="inline-flex px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all duration-300"
                    >
                      Browse Rental Cars
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
