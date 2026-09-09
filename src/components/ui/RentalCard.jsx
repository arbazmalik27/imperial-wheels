import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaGasPump, FaStar, FaHeart } from 'react-icons/fa';
import { FaGear } from 'react-icons/fa6';

const RentalCard = ({ car }) => {
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
          alt={car.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          {car.category}
        </div>
      </div>

      {/* Car Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Name and Rating */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900 font-display hover:text-blue-600 transition-colors">
            <Link to={`/rent/${car.id}`}>{car.name}</Link>
          </h3>
          <div className="flex items-center gap-1 mt-2">
            <FaStar className="text-amber-500 text-sm" />
            <span className="text-sm font-semibold text-slate-800">{car.rating.toFixed(2)}</span>
            <span className="text-xs text-slate-400">({car.reviewsCount} reviews)</span>
          </div>
        </div>

        {/* Specs Badges */}
        <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-100 mb-6 text-slate-600 text-sm">
          <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-2xl gap-1">
            <FaUser className="text-blue-500 text-base" />
            <span className="text-xs font-medium">{car.seats} Seats</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-2xl gap-1">
            <FaGasPump className="text-blue-500 text-base" />
            <span className="text-xs font-medium">{car.fuel}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-2xl gap-1">
            <FaGear className="text-blue-500 text-base" />
            <span className="text-xs font-medium truncate max-w-[70px]">{car.transmission}</span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Price Per Day</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 font-display">&#x20B9;{car.pricePerDay}</span>
              <span className="text-xs text-slate-500">/ day</span>
            </div>
          </div>
          <Link
            to={`/rent/${car.id}`}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 text-sm hover:translate-x-1 inline-flex items-center gap-1.5"
          >
            Rent Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default RentalCard;
