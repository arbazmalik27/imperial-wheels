import { useState } from 'react';
import { getCars, updateCar } from '../../utils/dataStore';
import { FaStar, FaBolt, FaCrown, FaCarSide } from 'react-icons/fa';
import { motion } from 'framer-motion';

const badges = [
  { key: 'featured', label: 'Featured', icon: FaStar, color: 'bg-amber-50 border-amber-300 text-amber-700', activeColor: 'bg-amber-400 text-white border-amber-400' },
  { key: 'trending', label: 'Trending', icon: FaBolt, color: 'bg-blue-50 border-blue-300 text-blue-700', activeColor: 'bg-blue-500 text-white border-blue-500' },
  { key: 'premium', label: 'Premium', icon: FaCrown, color: 'bg-violet-50 border-violet-300 text-violet-700', activeColor: 'bg-violet-600 text-white border-violet-600' },
];

const FeaturedCars = () => {
  const [cars, setCarsState] = useState(() => getCars());

  const refresh = () => setCarsState(getCars() || []);

  const toggleBadge = (id, badge) => {
    const car = cars.find(c => c.id === id);
    updateCar(id, { [badge]: !car[badge] });
    refresh();
  };

  const featuredCount = cars.filter(c => c.featured).length;
  const trendingCount = cars.filter(c => c.trending).length;
  const premiumCount = cars.filter(c => c.premium).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-slate-900 font-display">Featured Cars</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage badges displayed on the front-end listings</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[{ label: 'Featured', count: featuredCount, icon: FaStar, color: 'text-amber-500' },
          { label: 'Trending', count: trendingCount, icon: FaBolt, color: 'text-blue-500' },
          { label: 'Premium', count: premiumCount, icon: FaCrown, color: 'text-violet-500' }].map(({ label, count, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
            <Icon className={`text-2xl mx-auto mb-2 ${color}`} />
            <p className="text-2xl font-black text-slate-900">{count}</p>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cars.map(car => (
          <motion.div
            key={car.id}
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="relative h-36 bg-slate-100">
              <img
                src={car.images?.[0]}
                alt={car.name}
                className="w-full h-full object-cover"
                onError={e => e.target.src = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=400&q=60'}
              />
              <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                {car.featured && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-white flex items-center gap-1"><FaStar className="text-[8px]" /> Featured</span>}
                {car.trending && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500 text-white flex items-center gap-1"><FaBolt className="text-[8px]" /> Trending</span>}
                {car.premium && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-600 text-white flex items-center gap-1"><FaCrown className="text-[8px]" /> Premium</span>}
              </div>
            </div>
            <div className="p-4">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{car.category}</p>
              <h3 className="font-bold text-slate-900 text-sm line-clamp-1 mb-3">{car.name}</h3>
              <div className="flex gap-1 flex-wrap">
                {badges.map(({ key, label, icon: Icon, color, activeColor }) => (
                  <button
                    key={key}
                    onClick={() => toggleBadge(car.id, key)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${car[key] ? activeColor : color}`}
                  >
                    <Icon className="text-[8px]" /> {label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {cars.length === 0 && (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-100">
          <FaCarSide className="text-5xl text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-semibold">No cars to manage</p>
        </div>
      )}
    </div>
  );
};

export default FeaturedCars;
