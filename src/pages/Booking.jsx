import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaRegCalendarAlt, FaEnvelope, FaPhone, FaCar, FaMoneyCheckAlt, FaCheck, FaExclamationTriangle, FaMapMarkerAlt, FaStickyNote, FaShieldAlt } from 'react-icons/fa';
import { rentalCars } from '../utils/dummyData';
import { addBooking } from '../utils/dataStore';
import { useAuth } from '../hooks/useAuth';
import SectionHeader from '../components/ui/SectionHeader';
import { usePageMeta } from '../hooks/usePageMeta';

const Booking = () => {
  usePageMeta('Book a Car | Imperial Wheels');

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const carId = searchParams.get('carId');
  const urlPickup = searchParams.get('pickup') || '';
  const urlReturn = searchParams.get('return') || '';

  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [pickupDate, setPickupDate] = useState(urlPickup);
  const [returnDate, setReturnDate] = useState(urlReturn);
  const [pickupLocation, setPickupLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [submittedBooking, setSubmittedBooking] = useState(null);

  const car = useMemo(() => rentalCars.find(item => item.id === carId) || rentalCars[0], [carId]);

  // No effect needed here: AuthContext rehydrates `user` synchronously
  // before this component ever renders, so the useState initializers above
  // already have the right values on first paint.

  const billing = useMemo(() => {
    if (!pickupDate || !returnDate) return { days: 0, subtotal: 0, tax: 0, total: 0 };
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime <= 0) return { days: 0, subtotal: 0, tax: 0, total: 0 };
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const subtotal = days * car.pricePerDay;
    const tax = Math.floor(subtotal * 0.08);
    const total = subtotal + tax + 150;
    return { days, subtotal, tax, total };
  }, [pickupDate, returnDate, car.pricePerDay]);

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (billing.days <= 0) {
      alert('Invalid date selection! Make sure Return occurs after Pickup.');
      return;
    }

    const newBooking = addBooking({
      customerName: fullName,
      customerEmail: email,
      phone,
      carName: car.name,
      carId: car.id,
      carImage: car.images?.[0],
      pickupDate,
      returnDate,
      pickupLocation,
      notes,
      totalPrice: billing.total,
      userId: user?.id || 'guest',
      paymentMethod,
    });

    setSubmittedBooking(newBooking);
  };

  const handleSuccessClose = () => {
    setSubmittedBooking(null);
    navigate('/');
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader
          badge="Secure Reservation"
          title="Confirm Your Rental Booking"
          subtitle="Complete your booking details to confirm your reservation. Your booking will appear in your profile."
        />

        {!user && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
            <FaShieldAlt className="text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              <Link to="/login" className="font-bold underline">Sign in</Link> to save bookings to your profile and get faster checkout.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl premium-shadow">
            <h3 className="text-xl font-bold font-display text-slate-900 border-b border-slate-100 pb-3 mb-6">Customer Information</h3>

            <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="booking-fullname" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5"><FaUser className="text-blue-500" /> Full Name</label>
                  <input id="booking-fullname" type="text" required placeholder="e.g. John Doe" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold bg-slate-50 text-slate-800" />
                </div>
                <div>
                  <label htmlFor="booking-email" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5"><FaEnvelope className="text-blue-500" /> Email Address</label>
                  <input id="booking-email" type="email" required placeholder="e.g. john@example.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold bg-slate-50 text-slate-800" />
                </div>
                <div>
                  <label htmlFor="booking-phone" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5"><FaPhone className="text-blue-500" /> Contact Number</label>
                  <input id="booking-phone" type="tel" required placeholder="e.g. +91-98765-43210" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold bg-slate-50 text-slate-800" />
                </div>
                <div>
                  <label htmlFor="booking-pickup-location" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5"><FaMapMarkerAlt className="text-blue-500" /> Pickup Location</label>
                  <input id="booking-pickup-location" type="text" required placeholder="e.g. Mumbai Airport" value={pickupLocation} onChange={e => setPickupLocation(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold bg-slate-50 text-slate-800" />
                </div>
                <div>
                  <label htmlFor="booking-pickup-date" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5"><FaRegCalendarAlt className="text-blue-500" /> Pickup Date</label>
                  <input id="booking-pickup-date" type="date" required value={pickupDate} onChange={e => setPickupDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold bg-slate-50 text-slate-800" />
                </div>
                <div>
                  <label htmlFor="booking-return-date" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5"><FaRegCalendarAlt className="text-blue-500" /> Return Date</label>
                  <input id="booking-return-date" type="date" required value={returnDate} onChange={e => setReturnDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold bg-slate-50 text-slate-800" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="booking-notes" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5"><FaStickyNote className="text-blue-500" /> Additional Notes</label>
                  <textarea id="booking-notes" rows={3} placeholder="Any special requests or notes..." value={notes} onChange={e => setNotes(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold bg-slate-50 text-slate-800 resize-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-1.5"><FaMoneyCheckAlt className="text-blue-500" /> Payment Option</label>
                <div className="flex flex-col gap-3">
                  {[{ id: 'credit', label: 'Credit / Debit Card', sub: 'Pay securely via standard international cards.' }, { id: 'paypal', label: 'PayPal Checkout', sub: 'Log in and pay using your verified PayPal account.' }].map(opt => (
                    <label key={opt.id} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === opt.id ? 'border-blue-600 bg-blue-50/20' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <input type="radio" name="paymentOption" checked={paymentMethod === opt.id} onChange={() => setPaymentMethod(opt.id)} className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                      <div className="text-sm">
                        <span className="font-bold block text-slate-900">{opt.label}</span>
                        <span className="text-xs text-slate-500">{opt.sub}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={billing.days <= 0} className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all duration-300 shadow-md shadow-blue-500/10 hover:shadow-lg text-base flex items-center justify-center gap-2">
                Confirm Booking & Pay
              </button>
            </form>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-lg premium-shadow">
              <h3 className="text-lg font-bold font-display text-slate-900 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
                <FaCar className="text-blue-500 text-sm" /> Booking Summary
              </h3>
              <div className="flex gap-4 items-center mb-6">
                <div className="w-24 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                  <img src={car.images[0]} alt={car.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[10px] text-blue-600 uppercase font-bold tracking-wider">{car.category}</span>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{car.name}</h4>
                  <div className="flex gap-3 text-xs text-slate-400 mt-1 font-semibold">
                    <span>{car.seats} Seats</span><span>&bull;</span><span>{car.transmission}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 text-sm text-slate-600 border-t border-slate-100 pt-6">
                <div className="flex justify-between"><span>Daily Rate:</span><span className="font-bold text-slate-800">₹{car.pricePerDay.toLocaleString()} / day</span></div>
                <div className="flex justify-between"><span>Rental Duration:</span><span className="font-bold text-slate-800">{billing.days} day{billing.days !== 1 ? 's' : ''}</span></div>
                <div className="flex justify-between"><span>Subtotal:</span><span className="font-bold text-slate-800">₹{billing.subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Tax & Fees (8%):</span><span className="font-bold text-slate-800">₹{billing.tax.toLocaleString()}</span></div>
                <div className="flex justify-between pb-4 border-b border-slate-100"><span>Security Deposit <span className="text-slate-400 text-xs">(refundable)</span></span><span className="font-bold text-slate-800">₹150</span></div>
                {billing.days > 0 ? (
                  <div className="flex justify-between text-base pt-3"><span className="font-bold text-slate-900">Total Price Due:</span><span className="font-black text-blue-600 font-display">₹{billing.total.toLocaleString()}</span></div>
                ) : (
                  <div className="flex gap-2 items-center p-3 bg-amber-50 text-amber-800 rounded-xl text-xs font-semibold mt-2"><FaExclamationTriangle /><span>Please enter valid dates to calculate pricing.</span></div>
                )}
              </div>
            </div>
            <div className="bg-slate-900 rounded-3xl p-6 text-white text-xs leading-relaxed">
              <h4 className="font-bold text-sm mb-2 font-display uppercase tracking-wide">Need Help with Booking?</h4>
              <p className="text-slate-400 mb-3">Contact our 24/7 support team for assistance with your reservation.</p>
              <span className="font-bold text-blue-400 block">+91-75127-16271</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {submittedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 30, opacity: 0 }} transition={{ type: 'spring', damping: 25 }} className="bg-white rounded-[40px] p-8 md:p-12 max-w-md w-full relative text-center shadow-2xl z-10">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-200 animate-bounce">
                <FaCheck className="text-2xl" />
              </div>
              <h3 className="text-2xl font-black font-display text-slate-900 mb-3">Booking Confirmed!</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-2">
                Your reservation for the <span className="font-bold text-slate-800">{car.name}</span> is registered.
              </p>
              <p className="text-blue-600 font-black text-lg mb-6">ID: {submittedBooking.id}</p>
              <div className="p-4 bg-slate-50 rounded-2xl mb-8 text-left text-xs text-slate-500 space-y-2">
                <p><strong>Status:</strong> <span className="text-amber-600 font-bold">Pending (Admin approval required)</span></p>
                <p><strong>Renter:</strong> {fullName}</p>
                <p><strong>Duration:</strong> {billing.days} days ({pickupDate} → {returnDate})</p>
                <p><strong>Total Charged:</strong> ₹{billing.total.toLocaleString()}</p>
              </div>
              <button onClick={handleSuccessClose} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-colors shadow-lg">
                Back to Home Page
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Booking;
