import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaStar, FaRegCalendarAlt, FaCheck } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa6';
import { rentalCars } from '../utils/dummyData';
import { usePageMeta } from '../hooks/usePageMeta';

const RentalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find target car
  const car = useMemo(() => {
    return rentalCars.find(item => item.id === id) || rentalCars[0];
  }, [id]);

  usePageMeta(`Rent ${car.name} | Imperial Wheels`);

  // Gallery active image state
  const [activeImage, setActiveImage] = useState(car.images[0]);

  // Booking states
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  // Calculate rental duration and price
  const billing = useMemo(() => {
    if (!pickupDate || !returnDate) return { days: 0, subtotal: 0, tax: 0, total: 0 };
    
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    
    // Difference in milliseconds
    const diffTime = end.getTime() - start.getTime();
    if (diffTime <= 0) return { days: 0, subtotal: 0, tax: 0, total: 0 };
    
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const subtotal = days * car.pricePerDay;
    const tax = Math.floor(subtotal * 0.08); // 8% sales tax
    const total = subtotal + tax + 150; // $150 refundable damage deposit
    
    return { days, subtotal, tax, total };
  }, [pickupDate, returnDate, car.pricePerDay]);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (billing.days <= 0) {
      alert("Please select a valid Return Date that occurs after the Pickup Date.");
      return;
    }
    // Navigate to booking page with URL search params
    navigate(`/booking?type=rent&carId=${car.id}&pickup=${pickupDate}&return=${returnDate}`);
  };

  // Filter out current car for related vehicles
  const relatedCars = useMemo(() => {
    return rentalCars.filter(item => item.id !== car.id && item.category === car.category).slice(0, 3);
  }, [car.id, car.category]);

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          to="/rent"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 mb-8 transition-colors"
        >
          <FaArrowLeft /> Back to Rental Fleet
        </Link>

        {/* Dynamic Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: Gallery and specs (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Gallery Component */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="h-[350px] md:h-[480px] w-full rounded-2xl overflow-hidden bg-slate-100 mb-4">
                <img
                  src={activeImage}
                  alt={car.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-1">
                {car.images.map((img, index) => (
                  <button
                    key={img}
                    onClick={() => setActiveImage(img)}
                    className={`w-24 h-16 md:w-28 md:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border-2 transition-all ${
                      activeImage === img ? 'border-blue-600 scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${car.name} thumb ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Core Info & Specs */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col gap-6">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">{car.category}</span>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-slate-900 mt-3">{car.name}</h1>
                <div className="flex items-center gap-2 mt-3 text-slate-500 text-sm">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-amber-500" />
                    <span className="text-slate-800 font-bold">{car.rating.toFixed(2)}</span>
                  </div>
                  <span>&bull;</span>
                  <span>{car.reviewsCount} reviews verified</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-lg font-bold font-display text-slate-900 mb-4">Vehicle Description</h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  {car.description}
                </p>
              </div>

              {/* Technical Specifications Grid */}
              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-lg font-bold font-display text-slate-900 mb-4">Performance Specifications</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <span className="text-xs text-slate-400 font-semibold uppercase block">Engine</span>
                    <span className="text-sm font-bold text-slate-800 mt-1 block">{car.engine}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <span className="text-xs text-slate-400 font-semibold uppercase block">Output Power</span>
                    <span className="text-sm font-bold text-slate-800 mt-1 block">{car.power}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <span className="text-xs text-slate-400 font-semibold uppercase block">0-60 MPH Acceleration</span>
                    <span className="text-sm font-bold text-slate-800 mt-1 block">{car.acceleration}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <span className="text-xs text-slate-400 font-semibold uppercase block">Transmission</span>
                    <span className="text-sm font-bold text-slate-800 mt-1 block">{car.transmission}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Included Features */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold font-display text-slate-900 mb-6 pb-3 border-b border-slate-100">
                Premium Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {car.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl text-slate-700">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <FaCheck className="text-xs" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold font-display text-slate-900 mb-6">
                Customer Reviews ({car.reviewsCount})
              </h3>
              <div className="flex flex-col gap-6">
                {/* Review 1 */}
                <div className="border-b border-slate-100 pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-800">
                        JH
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">John Higgins</h4>
                        <span className="text-xs text-slate-400">June 2026</span>
                      </div>
                    </div>
                    <div className="flex text-amber-500 text-sm">
                      &#9733;&#9733;&#9733;&#9733;&#9733;
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed pl-13">
                    The {car.name} exceeded every single expectation. The car arrived super clean, fully charged/fueled, and the pick-up/drop-off service was flawless. Highly recommended!
                  </p>
                </div>

                {/* Review 2 */}
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-800">
                        LN
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">Lisa Nordstrom</h4>
                        <span className="text-xs text-slate-400">May 2026</span>
                      </div>
                    </div>
                    <div className="flex text-amber-500 text-sm">
                      &#9733;&#9733;&#9733;&#9733;&#9734;
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed pl-13">
                    Stunning styling and raw power. The acceleration is violent yet the cabin feels exceptionally quiet. Would definitely book again next time I'm in town.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Booking calculation Sidebar (4 cols) */}
          <div className="lg:col-span-4 sticky top-28">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg premium-shadow">
              <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Rental Price</span>
              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="text-4xl font-black text-slate-900 font-display">₹{car.pricePerDay}</span>
                <span className="text-sm text-slate-500">/ day</span>
              </div>

              <form onSubmit={handleBookingSubmit} className="flex flex-col gap-4">
                {/* Dates Inputs */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FaRegCalendarAlt className="text-blue-500" /> Pickup Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold text-slate-800 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FaRegCalendarAlt className="text-blue-500" /> Return Date
                  </label>
                  <input
                    type="date"
                    required
                    min={pickupDate || new Date().toISOString().split('T')[0]}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold text-slate-800 bg-slate-50"
                  />
                </div>

                {/* Price Breakdown */}
                {billing.days > 0 ? (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>₹{car.pricePerDay} x {billing.days} days</span>
                      <span className="font-semibold text-slate-800">₹{billing.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Sales Tax & Road Fees (8%)</span>
                      <span className="font-semibold text-slate-800">₹{billing.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 pb-3 border-b border-slate-100">
                      <span className="flex items-center gap-1.5">
                        Damage Deposit <span className="text-slate-400 text-xs">(refundable)</span>
                      </span>
                      <span className="font-semibold text-slate-800">₹150</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="font-bold text-slate-900">Total Price</span>
                      <span className="font-black text-blue-600 font-display">₹{billing.total.toLocaleString()}</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-400">
                    Select pickup and return dates to calculate price.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={billing.days <= 0}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all duration-300 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 text-base mt-2 flex items-center justify-center gap-2"
                >
                  Book Rental Now
                </button>
              </form>

              <div className="mt-6 text-center text-xs text-slate-400">
                You won't be charged yet. Deposit is fully refundable within 48h.
              </div>
            </div>
          </div>

        </div>

        {/* Related Vehicles Section */}
        {relatedCars.length > 0 && (
          <div className="mt-16 border-t border-slate-200 pt-16">
            <h3 className="text-2xl font-bold font-display text-slate-900 mb-8">
              Similar Sports Vehicles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedCars.map((relatedCar) => (
                <div key={relatedCar.id} className="bg-white rounded-3xl overflow-hidden shadow-md flex flex-col h-full border border-slate-100">
                  <div className="relative h-44 bg-slate-100">
                    <img src={relatedCar.images[0]} alt={relatedCar.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div>
                      <h4 className="font-bold text-slate-900 font-display text-lg mb-1">{relatedCar.name}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <FaStar className="text-amber-500" />
                        <span>{relatedCar.rating.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
                      <span className="font-extrabold text-slate-900 text-lg">₹{relatedCar.pricePerDay}/day</span>
                      <Link to={`/rent/${relatedCar.id}`} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                        View Info &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default RentalDetails;
