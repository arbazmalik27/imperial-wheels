import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaTimes, FaUndo } from 'react-icons/fa';
import RentalCard from '../components/ui/RentalCard';
import { rentalCars } from '../utils/dummyData';
import SectionHeader from '../components/ui/SectionHeader';
import { usePageMeta } from '../hooks/usePageMeta';

// Declared outside RentCars: a component created inside a parent's render
// body gets recreated (and any internal state reset) on every re-render.
const FilterPanelContent = ({
  selectedPrice, onPriceChange,
  selectedBrand, onBrandChange,
  availableBrands,
  selectedFuel, onFuelChange,
  selectedTransmission, onTransmissionChange,
  selectedSeats, onSeatsChange,
  onReset,
}) => (
  <div className="flex flex-col gap-6 text-slate-800">
    {/* Price Slider */}
    <div>
      <div className="flex justify-between items-center mb-2">
        <label htmlFor="rent-filter-price" className="text-sm font-bold uppercase tracking-wider text-slate-400">Max Price/Day</label>
        <span className="text-base font-extrabold text-blue-600 font-display">₹{selectedPrice}</span>
      </div>
      <input
        id="rent-filter-price"
        type="range"
        min="10000"
        max="100000"
        step="5000"
        value={selectedPrice}
        onChange={(e) => onPriceChange(parseInt(e.target.value, 10))}
        className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
      />
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>₹10k</span>
        <span>₹1L</span>
      </div>
    </div>

    {/* Brand Select */}
    <div>
      <label htmlFor="rent-filter-brand" className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Brand</label>
      <select
        id="rent-filter-brand"
        value={selectedBrand}
        onChange={(e) => onBrandChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50 text-sm font-medium"
      >
        <option value="">All Brands</option>
        {availableBrands.map(brand => (
          <option key={brand} value={brand}>{brand}</option>
        ))}
      </select>
    </div>

    {/* Fuel Type */}
    <div>
      <label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Fuel Type</label>
      <div className="flex flex-col gap-2">
        {['Petrol', 'Electric'].map(type => (
          <label key={type} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-600 hover:text-slate-900">
            <input
              type="radio"
              name="fuelType"
              checked={selectedFuel === type}
              onChange={() => onFuelChange(type)}
              className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            {type}
          </label>
        ))}
      </div>
    </div>

    {/* Transmission */}
    <div>
      <label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Transmission</label>
      <div className="flex flex-col gap-2">
        {['Automatic', 'Manual'].map(type => (
          <label key={type} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-600 hover:text-slate-900">
            <input
              type="radio"
              name="transmissionType"
              checked={selectedTransmission === type}
              onChange={() => onTransmissionChange(type)}
              className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            {type}
          </label>
        ))}
      </div>
    </div>

    {/* Seating Capacity */}
    <div>
      <label htmlFor="rent-filter-seats" className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Seating Capacity</label>
      <select
        id="rent-filter-seats"
        value={selectedSeats}
        onChange={(e) => onSeatsChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50 text-sm font-medium"
      >
        <option value="">Any Capacity</option>
        <option value="2">2 Seats (Supercars)</option>
        <option value="4">4 Seats (Sports Coupe)</option>
        <option value="5">5 Seats (Luxury Sedan/SUVs)</option>
      </select>
    </div>

    {/* Reset Button */}
    <button
      onClick={onReset}
      className="w-full py-3 mt-4 border border-dashed border-slate-200 hover:border-red-500 hover:text-red-500 text-slate-500 font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
    >
      <FaUndo /> Reset All Filters
    </button>
  </div>
);

const RentCars = () => {
  usePageMeta(
    'Rent Cars | Imperial Wheels',
    'Browse and rent luxury and performance cars by the day with Imperial Wheels.'
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const urlBrand = searchParams.get('brand') || '';
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(urlBrand);
  const [selectedPrice, setSelectedPrice] = useState(100000); // Max budget
  const [selectedFuel, setSelectedFuel] = useState('');
  const [selectedTransmission, setSelectedTransmission] = useState('');
  const [selectedSeats, setSelectedSeats] = useState('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Extract unique brands for selector
  const availableBrands = useMemo(() => {
    const brands = rentalCars.map(car => car.brand);
    return [...new Set(brands)];
  }, []);

  // Filter cars logic
  const filteredCars = useMemo(() => {
    return rentalCars.filter(car => {
      const matchSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          car.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchBrand = selectedBrand === '' || car.brand === selectedBrand;
      const matchPrice = car.pricePerDay <= selectedPrice;
      const matchFuel = selectedFuel === '' || car.fuel === selectedFuel;
      const matchTransmission = selectedTransmission === '' || car.transmission === selectedTransmission;
      const matchSeats = selectedSeats === '' || car.seats === parseInt(selectedSeats, 10);
      
      return matchSearch && matchBrand && matchPrice && matchFuel && matchTransmission && matchSeats;
    });
  }, [searchTerm, selectedBrand, selectedPrice, selectedFuel, selectedTransmission, selectedSeats]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedBrand('');
    setSelectedPrice(100000);
    setSelectedFuel('');
    setSelectedTransmission('');
    setSelectedSeats('');
    setSearchParams({});
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
    setSearchParams(brand ? { brand } : {});
  };

  const filterPanelProps = {
    selectedPrice, onPriceChange: setSelectedPrice,
    selectedBrand, onBrandChange: handleBrandChange,
    availableBrands,
    selectedFuel, onFuelChange: setSelectedFuel,
    selectedTransmission, onTransmissionChange: setSelectedTransmission,
    selectedSeats, onSeatsChange: setSelectedSeats,
    onReset: resetFilters,
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <SectionHeader 
          badge="Rent Elite Fleet"
          title="Find Your Driving Experience"
          subtitle="Select from our premium lineup of high-performance supercars and executive crossovers."
          align="left"
        />

        {/* Search Bar & Mobile Filter Trigger */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              aria-label="Search rental cars"
              placeholder="Search by brand, name or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-semibold text-slate-800 shadow-sm"
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <span className="text-sm font-semibold text-slate-500">
              Showing <span className="text-slate-900 font-bold">{filteredCars.length}</span> luxury cars
            </span>
            
            {/* Mobile Filters Toggle Button */}
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 shadow-sm"
            >
              <FaFilter className="text-blue-500" /> Filters
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar (sticky) */}
          <aside className="hidden lg:block bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm h-fit sticky top-28">
            <h3 className="text-lg font-bold font-display text-slate-900 mb-6 flex items-center gap-2 pb-3 border-b border-slate-100">
              <FaFilter className="text-blue-600 text-sm" /> Advanced Filters
            </h3>
            <FilterPanelContent {...filterPanelProps} />
          </aside>

          {/* Cars Grid */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="popLayout">
              {filteredCars.length > 0 ? (
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {filteredCars.map((car) => (
                    <RentalCard key={car.id} car={car} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 max-w-lg mx-auto"
                >
                  <h4 className="text-xl font-bold font-display text-slate-900 mb-2">No cars match your criteria</h4>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    Try softening your filters, raising your budget, or checking a different brand.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/10"
                  >
                    Reset Search Parameters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 w-80 h-full bg-white shadow-2xl flex flex-col p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <h3 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
                  <FaFilter className="text-blue-600 text-sm" /> Filters
                </h3>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1 hover:text-red-500"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>

              <FilterPanelContent {...filterPanelProps} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RentCars;
