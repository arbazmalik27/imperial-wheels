import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaCalendarAlt, FaTachometerAlt, FaGasPump } from 'react-icons/fa';

const UsedCarCard = ({ car }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-3xl overflow-hidden premium-shadow hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col h-full relative"
    >
      {/* Favorite Button */}
      <button
        onClick={() => setIsLiked(!isLiked)}
        className="absolute top-4 right-4 z-10 p-2.5 rounded-full glass-panel hover:bg-white text-slate-600 hover:text-red-500 transition-all duration-300 shadow-sm"
      >
        <FaHeart className={`text-lg transition-colors duration-300 ${isLiked ? 'text-red-500 fill-red-500' : 'text-slate-400'}`} />
      </button>

      {/* Car Image */}
      <div className="relative h-52 overflow-hidden bg-slate-100 group">
        <img
          src={car.images[0]}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
          Used Certified
        </div>
      </div>

      {/* Car Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title and brand */}
        <div className="mb-4">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">{car.brand}</span>
          <h3 className="text-xl font-bold text-slate-900 font-display hover:text-blue-600 transition-colors truncate">
            <Link to={`/buy/${car.id}`}>{car.model}</Link>
          </h3>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-100 mb-6 text-slate-600 text-sm">
          <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-2xl gap-1">
            <FaCalendarAlt className="text-amber-500 text-base" />
            <span className="text-xs font-semibold">{car.year}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-2xl gap-1">
            <FaTachometerAlt className="text-amber-500 text-base" />
            <span className="text-xs font-semibold">{car.mileage.toLocaleString()} mi</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-2xl gap-1">
            <FaGasPump className="text-amber-500 text-base" />
            <span className="text-xs font-semibold">{car.fuel}</span>
          </div>
        </div>

        {/* Price and Details link */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Price</span>
            <span className="text-2xl font-black text-slate-900 font-display">&#x20B9;{car.price.toLocaleString()}</span>
          </div>
          <Link
            to={`/buy/${car.id}`}
            className="px-5 py-3 bg-slate-900 hover:bg-blue-600 text-white font-semibold rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default UsedCarCard;
