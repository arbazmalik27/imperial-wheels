import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaTachometerAlt, FaGasPump, FaStar, FaUser, FaPhoneAlt, FaEnvelope, FaShieldAlt, FaInfoCircle } from 'react-icons/fa';
import { FaGear, FaArrowLeft } from 'react-icons/fa6';
import { usedCars } from '../utils/dummyData';
import { usePageMeta } from '../hooks/usePageMeta';

const BuyCarDetails = () => {
  const { id } = useParams();
  
  // Find current used car
  const car = useMemo(() => {
    return usedCars.find(item => item.id === id) || usedCars[0];
  }, [id]);

  usePageMeta(`${car.year} ${car.brand} ${car.model} | Imperial Wheels`);

  // Gallery active state
  const [activeImage, setActiveImage] = useState(car.images[0] || car.images[0]);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState(`Hi, I'm interested in your ${car.year} ${car.brand} ${car.model}. Please contact me as soon as possible.`);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      alert(`Message successfully sent to ${car.seller.name}! They will get in touch with you shortly.`);
      setContactName('');
      setContactEmail('');
      setFormSubmitted(false);
    }, 800);
  };

  // Find similar used cars (excluding current)
  const similarCars = useMemo(() => {
    return usedCars.filter(item => item.id !== car.id && (item.brand === car.brand || Math.abs(item.price - car.price) < 15000)).slice(0, 3);
  }, [car.id, car.brand, car.price]);

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          to="/buy"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 mb-8 transition-colors"
        >
          <FaArrowLeft /> Back to Used Car Catalog
        </Link>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (8 cols): Gallery, Specs, Condition, Seller */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Gallery */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="h-[350px] md:h-[480px] w-full rounded-2xl overflow-hidden bg-slate-100 mb-4">
                <img
                  src={activeImage}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover animate-fade-in"
                />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-1">
                {car.images.map((img, idx) => (
                  <button
                    key={img}
                    onClick={() => setActiveImage(img)}
                    className={`w-24 h-16 md:w-28 md:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border-2 transition-all ${
                      activeImage === img ? 'border-blue-600 scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${car.brand} thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Overview Block */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <div className="mb-6">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">{car.brand} Certified</span>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-slate-900 mt-3">{car.model}</h1>
                <div className="flex items-center gap-4 mt-3 text-slate-500 text-sm">
                  <span className="flex items-center gap-1"><FaCalendarAlt /> Year {car.year}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1"><FaTachometerAlt /> {car.mileage.toLocaleString()} miles</span>
                </div>
              </div>

              {/* Grid of Key Features */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-slate-100 mb-6">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <span className="text-xs text-slate-400 font-semibold uppercase block">Fuel Type</span>
                  <span className="text-sm font-bold text-slate-800 mt-1 block flex items-center gap-1.5"><FaGasPump className="text-blue-500" /> {car.fuel}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <span className="text-xs text-slate-400 font-semibold uppercase block">Transmission</span>
                  <span className="text-sm font-bold text-slate-800 mt-1 block flex items-center gap-1.5"><FaGear className="text-blue-500" /> {car.transmission}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <span className="text-xs text-slate-400 font-semibold uppercase block">Exterior Color</span>
                  <span className="text-sm font-bold text-slate-800 mt-1 block truncate">{car.color}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <span className="text-xs text-slate-400 font-semibold uppercase block">Previous Owners</span>
                  <span className="text-sm font-bold text-slate-800 mt-1 block flex items-center gap-1.5"><FaUser className="text-blue-500" /> {car.owners} Owner{car.owners > 1 ? 's' : ''}</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold font-display text-slate-900 mb-3">Seller's Notes</h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  {car.description}
                </p>
              </div>
            </div>

            {/* Spec Sheet & Mechanical Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Specs */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold font-display text-slate-900 mb-6 pb-2 border-b border-slate-100">
                  Specifications
                </h3>
                <ul className="flex flex-col gap-4 text-sm text-slate-600">
                  <li className="flex justify-between">
                    <span className="font-medium">Engine Configuration</span>
                    <span className="font-bold text-slate-800">{car.engine}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium">Total Horsepower</span>
                    <span className="font-bold text-slate-800">{car.power}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium">Transmission</span>
                    <span className="font-bold text-slate-800">{car.transmission}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium">Fuel System</span>
                    <span className="font-bold text-slate-800">{car.fuel}</span>
                  </li>
                </ul>
              </div>

              {/* Condition */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold font-display text-slate-900 mb-4 pb-2 border-b border-slate-100">
                    Vehicle Condition
                  </h3>
                  <div className="flex items-center gap-2 mb-4 bg-emerald-50 text-emerald-800 px-4 py-3 rounded-2xl text-sm font-semibold">
                    <FaShieldAlt className="text-lg" />
                    <span>Certified DriveHub Clean History Report</span>
                  </div>
                  <ul className="flex flex-col gap-3 text-sm text-slate-600">
                    <li className="flex justify-between">
                      <span>Accident History</span>
                      <span className="font-bold text-slate-800">None reported</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Reported Condition</span>
                      <span className="font-bold text-slate-800">{car.condition}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Service Records</span>
                      <span className="font-bold text-slate-800">Fully documented</span>
                    </li>
                  </ul>
                </div>
                <div className="text-xs text-slate-400 mt-4 flex items-center gap-1.5">
                  <FaInfoCircle /> Reports generated automatically on inventory updates.
                </div>
              </div>

            </div>

            {/* Seller profile */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black font-display text-xl border border-blue-100">
                  {car.seller.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-slate-900">{car.seller.name}</h3>
                  <span className="text-xs text-slate-400 font-semibold block">{car.seller.type} &bull; Verified Account</span>
                  <div className="flex items-center gap-1 mt-1">
                    <FaStar className="text-amber-500 text-xs" />
                    <span className="text-xs font-bold text-slate-800">{car.seller.rating.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:items-end text-sm text-slate-600 gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-2"><FaPhoneAlt className="text-blue-500" /> {car.seller.phone}</div>
                <div className="flex items-center gap-2"><FaEnvelope className="text-blue-500" /> {car.seller.email}</div>
              </div>
            </div>

          </div>

          {/* Right Column (4 cols): Pricing & Contact Seller Form */}
          <div className="lg:col-span-4 sticky top-28">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg premium-shadow">
              
              <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Buy Price</span>
              <div className="text-4xl font-black text-slate-900 font-display mb-6">
                ₹{car.price.toLocaleString()}
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1">Buy Safely Guidelines</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Always inspect the vehicle in person at a neutral location. Never wire funds in advance of inspecting the title.
                </p>
              </div>

              {/* Inquiry Form */}
              <h3 className="text-base font-bold font-display text-slate-900 mb-4 uppercase tracking-wider">Contact Seller</h3>
              <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold text-slate-800 bg-slate-50"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Your Email Address"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold text-slate-800 bg-slate-50"
                  />
                </div>
                <div>
                  <textarea
                    required
                    rows="4"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold text-slate-800 bg-slate-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formSubmitted}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-2xl transition-all duration-300 shadow-md shadow-blue-500/10 hover:shadow-lg text-sm flex items-center justify-center gap-2"
                >
                  Send Inquiry Message
                </button>
              </form>

            </div>
          </div>

        </div>

        {/* Similar Cars Section */}
        {similarCars.length > 0 && (
          <div className="mt-16 border-t border-slate-200 pt-16">
            <h3 className="text-2xl font-bold font-display text-slate-900 mb-8">
              Similar Vehicles You May Like
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarCars.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-md flex flex-col h-full border border-slate-100">
                  <div className="relative h-44 bg-slate-100">
                    <img src={item.images[0]} alt={item.model} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div>
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{item.brand}</span>
                      <h4 className="font-bold text-slate-900 font-display text-lg mb-1">{item.model}</h4>
                      <div className="flex gap-4 text-xs text-slate-500 mt-2">
                        <span>{item.year}</span>
                        <span>{item.mileage.toLocaleString()} mi</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
                      <span className="font-extrabold text-slate-900 text-lg">₹{item.price.toLocaleString()}</span>
                      <Link to={`/buy/${item.id}`} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                        View Details &rarr;
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

export default BuyCarDetails;
