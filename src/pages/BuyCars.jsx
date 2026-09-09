import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaTimes, FaUndo, FaSortAmountDown } from 'react-icons/fa';
import UsedCarCard from '../components/ui/UsedCarCard';
import { usedCars } from '../utils/dummyData';
import SectionHeader from '../components/ui/SectionHeader';
import { usePageMeta } from '../hooks/usePageMeta';

// Declared outside BuyCars: a component created inside a parent's render
// body gets recreated (and any internal state reset) on every re-render.
const FilterPanelContent = ({
  searchTerm, onSearchChange,
  selectedBrand, onBrandChange,
  availableBrands,
  selectedMaxPrice, onMaxPriceChange,
  selectedMinYear, onMinYearChange,
  selectedMaxMileage, onMaxMileageChange,
  selectedFuel, onFuelChange,
  onReset,
}) => (
  <div className="flex flex-col gap-6 text-slate-800">
    {/* Search Input inside sidebar */}
    <div>
      <label htmlFor="buy-filter-keyword" className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Keyword</label>
      <input
        id="buy-filter-keyword"
        type="text"
        placeholder="Model, engine... (e.g. M Sport)"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50 text-sm font-medium"
      />
    </div>

    {/* Brand Select */}
    <div>
      <label htmlFor="buy-filter-brand" className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Brand</label>
      <select
        id="buy-filter-brand"
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

    {/* Max Price Range */}
    <div>
      <div className="flex justify-between items-center mb-2">
        <label htmlFor="buy-filter-price" className="text-sm font-bold uppercase tracking-wider text-slate-400">Max Budget</label>
        <span className="text-base font-extrabold text-blue-600 font-display">₹{selectedMaxPrice.toLocaleString()}</span>
      </div>
      <input
        id="buy-filter-price"
        type="range"
        min="2000000"
        max="35000000"
        step="500000"
        value={selectedMaxPrice}
        onChange={(e) => onMaxPriceChange(parseInt(e.target.value, 10))}
        className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
      />
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>₹20L</span>
        <span>₹3.5Cr</span>
      </div>
    </div>

    {/* Min Year Select */}
    <div>
      <label htmlFor="buy-filter-min-year" className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Min Year</label>
      <select
        id="buy-filter-min-year"
        value={selectedMinYear}
        onChange={(e) => onMinYearChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50 text-sm font-medium"
      >
        <option value="">Any Year</option>
        <option value="2019">2019 or newer</option>
        <option value="2020">2020 or newer</option>
        <option value="2021">2021 or newer</option>
        <option value="2022">2022 or newer</option>
      </select>
    </div>

    {/* Max Mileage Slider */}
    <div>
      <div className="flex justify-between items-center mb-2">
        <label htmlFor="buy-filter-mileage" className="text-sm font-bold uppercase tracking-wider text-slate-400">Max Mileage</label>
        <span className="text-base font-extrabold text-blue-600 font-display">{selectedMaxMileage.toLocaleString()} mi</span>
      </div>
      <input
        id="buy-filter-mileage"
        type="range"
        min="5000"
        max="60000"
        step="2500"
        value={selectedMaxMileage}
        onChange={(e) => onMaxMileageChange(parseInt(e.target.value, 10))}
        className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
      />
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>5k mi</span>
        <span>60k mi</span>
      </div>
    </div>

    {/* Fuel Type */}
    <div>
      <label htmlFor="buy-filter-fuel" className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Fuel Type</label>
      <select
        id="buy-filter-fuel"
        value={selectedFuel}
        onChange={(e) => onFuelChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50 text-sm font-medium"
      >
        <option value="">Any Fuel</option>
        <option value="Petrol">Petrol</option>
        <option value="Electric">Electric</option>
        <option value="Hybrid">Hybrid</option>
      </select>
    </div>

    {/* Reset */}
    <button
      onClick={onReset}
      className="w-full py-3 mt-4 border border-dashed border-slate-200 hover:border-red-500 hover:text-red-500 text-slate-500 font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
    >
      <FaUndo /> Reset All Filters
    </button>
  </div>
);

const BuyCars = () => {
  usePageMeta(
    'Buy Used Cars | Imperial Wheels',
    'Shop certified pre-owned luxury and performance cars on the Imperial Wheels marketplace.'
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  const urlBrand = searchParams.get('brand') || '';
  const urlMaxPrice = searchParams.get('maxPrice') || '';

  // Filter States
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [selectedBrand, setSelectedBrand] = useState(urlBrand);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(urlMaxPrice ? parseInt(urlMaxPrice, 10) : 35000000);
  const [selectedMinYear, setSelectedMinYear] = useState('');
  const [selectedMaxMileage, setSelectedMaxMileage] = useState(60000);
  const [selectedFuel, setSelectedFuel] = useState('');
  const [sortBy, setSortBy] = useState('price-asc'); // 'price-asc', 'price-desc', 'year-desc', 'mileage-asc'
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync state with URL params. This one is intentional: unlike the initial
  // useState(urlSearch) above (which only runs once, on mount), this effect
  // re-syncs the filters when the user navigates back to /buy?search=... with
  // new params from elsewhere (e.g. the navbar search box) while already on
  // this page — the route doesn't remount, so only an effect can catch that.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (urlSearch) setSearchTerm(urlSearch);
    if (urlBrand) setSelectedBrand(urlBrand);
    if (urlMaxPrice) setSelectedMaxPrice(parseInt(urlMaxPrice, 10));
  }, [urlSearch, urlBrand, urlMaxPrice]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Extract unique brands
  const availableBrands = useMemo(() => {
    const brands = usedCars.map(car => car.brand);
    return [...new Set(brands)];
  }, []);

  // Filter & Sort Logic
  const filteredAndSortedCars = useMemo(() => {
    // 1. Filter
    let result = usedCars.filter(car => {
      const matchSearch = car.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          car.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchBrand = selectedBrand === '' || car.brand === selectedBrand;
      const matchPrice = car.price <= selectedMaxPrice;
      const matchYear = selectedMinYear === '' || car.year >= parseInt(selectedMinYear, 10);
      const matchMileage = car.mileage <= selectedMaxMileage;
      const matchFuel = selectedFuel === '' || car.fuel === selectedFuel;

      return matchSearch && matchBrand && matchPrice && matchYear && matchMileage && matchFuel;
    });

    // 2. Sort
    result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'year-desc') return b.year - a.year;
      if (sortBy === 'mileage-asc') return a.mileage - b.mileage;
      return 0;
    });

    return result;
  }, [searchTerm, selectedBrand, selectedMaxPrice, selectedMinYear, selectedMaxMileage, selectedFuel, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedBrand('');
    setSelectedMaxPrice(35000000);
    setSelectedMinYear('');
    setSelectedMaxMileage(60000);
    setSelectedFuel('');
    setSortBy('price-asc');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <SectionHeader 
          badge="Buy Used Cars"
          title="Certified Pre-Owned Inventory"
          subtitle="Acquire luxury high-performance vehicles verified by DriveHub inspection programs."
          align="left"
        />

        {/* Search, Sort and Mobile Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              aria-label="Search used cars"
              placeholder="Search used cars... (e.g. GTS, Model 3)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-semibold text-slate-800 shadow-sm"
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          </div>

          <div className="flex flex-wrap items-center justify-between w-full md:w-auto gap-4">
            
            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm text-sm">
              <FaSortAmountDown className="text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="focus:outline-none font-bold text-slate-700 bg-transparent cursor-pointer"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="year-desc">Year: Newest First</option>
                <option value="mileage-asc">Mileage: Lowest First</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-500 whitespace-nowrap">
                Found <span className="text-slate-900 font-bold">{filteredAndSortedCars.length}</span> cars
              </span>
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 shadow-sm"
              >
                <FaFilter className="text-blue-500" /> Filters
              </button>
            </div>

          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm h-fit sticky top-28">
            <h3 className="text-lg font-bold font-display text-slate-900 mb-6 flex items-center gap-2 pb-3 border-b border-slate-100">
              <FaFilter className="text-blue-600 text-sm" /> Refine Search
            </h3>
            <FilterPanelContent
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedBrand={selectedBrand}
              onBrandChange={setSelectedBrand}
              availableBrands={availableBrands}
              selectedMaxPrice={selectedMaxPrice}
              onMaxPriceChange={setSelectedMaxPrice}
              selectedMinYear={selectedMinYear}
              onMinYearChange={setSelectedMinYear}
              selectedMaxMileage={selectedMaxMileage}
              onMaxMileageChange={setSelectedMaxMileage}
              selectedFuel={selectedFuel}
              onFuelChange={setSelectedFuel}
              onReset={resetFilters}
            />
          </aside>

          {/* Cars Grid */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="popLayout">
              {filteredAndSortedCars.length > 0 ? (
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {filteredAndSortedCars.map((car) => (
                    <UsedCarCard key={car.id} car={car} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 max-w-lg mx-auto"
                >
                  <h4 className="text-xl font-bold font-display text-slate-900 mb-2">No used cars found</h4>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    Try adjusting your sliders, removing the keyword search filter, or picking another maker.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 transition-colors shadow-md"
                  >
                    Clear Filter Selection
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

              <FilterPanelContent
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedBrand={selectedBrand}
              onBrandChange={setSelectedBrand}
              availableBrands={availableBrands}
              selectedMaxPrice={selectedMaxPrice}
              onMaxPriceChange={setSelectedMaxPrice}
              selectedMinYear={selectedMinYear}
              onMinYearChange={setSelectedMinYear}
              selectedMaxMileage={selectedMaxMileage}
              onMaxMileageChange={setSelectedMaxMileage}
              selectedFuel={selectedFuel}
              onFuelChange={setSelectedFuel}
              onReset={resetFilters}
            />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BuyCars;
