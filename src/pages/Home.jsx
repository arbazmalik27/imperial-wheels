import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { FaCar, FaSearch, FaMapMarkerAlt, FaTag, FaCheckCircle, FaUserShield, FaHeadset, FaBolt, FaChevronDown } from 'react-icons/fa';
import { usePageMeta } from '../hooks/usePageMeta';

// Swiper CSS
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Custom components
import RentalCard from '../components/ui/RentalCard';
import UsedCarCard from '../components/ui/UsedCarCard';
import StatCounter from '../components/ui/StatCounter';
import SectionHeader from '../components/ui/SectionHeader';

// Dummy data
import { rentalCars, usedCars, testimonials, brands, faqData } from '../utils/dummyData';

const Home = () => {
  usePageMeta(
    'Imperial Wheels | Rent, Buy & Sell Cars',
    'Rent luxury cars, buy certified pre-owned vehicles, or sell your car with Imperial Wheels.'
  );

  const navigate = useNavigate();
  const [activeSearchTab, setActiveSearchTab] = useState('rent'); // 'rent' or 'buy'
  const [searchLocation, setSearchLocation] = useState('');
  const [searchBrand, setSearchBrand] = useState('');
  const [searchBudget, setSearchBudget] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (activeSearchTab === 'rent') {
      navigate(`/rent?brand=${searchBrand}&location=${searchLocation}`);
    } else {
      navigate(`/buy?brand=${searchBrand}&maxPrice=${searchBudget}`);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="bg-slate-50 font-sans pb-1">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-24 gradient-bg-hero">
        {/* Background Decorative Blobs */}
        <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow z-0" />
        <div className="absolute bottom-10 left-[-10%] w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] animate-pulse-slow z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-6 flex flex-col justify-center text-left"
          >
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 rounded-full mb-6 w-fit shadow-sm">
              Premium Automotive Hub
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight font-display text-slate-900 leading-[1.1] mb-6">
              Drive. <span className="gradient-text">Buy.</span> Sell.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-8">
              Experience luxury travel, find your next certified pre-owned dream car, or sell your current ride at top value. All in one premium marketplace.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link
                to="/rent"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-1"
              >
                Rent Luxury Cars
              </Link>
              <Link
                to="/buy"
                className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:-translate-y-1"
              >
                Browse Used Cars
              </Link>
            </div>

            {/* Quick Hero Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200">
              <div>
                <div className="text-2xl md:text-3xl font-black text-slate-900 font-display">
                  <StatCounter end={15000} suffix="+" />
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">Renters</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-black text-slate-900 font-display">
                  <StatCounter end={500} suffix="+" />
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">Supercars</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-black text-slate-900 font-display">
                  <StatCounter end={50} suffix="+" />
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">Cities</div>
              </div>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-6 relative h-[350px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white group bg-slate-200"
          >
            <img
              src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80"
              alt="Porsche 911 Hero"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1 font-display">Porsche 911 Carrera S</span>
              <p className="text-sm font-semibold opacity-90">Available for immediate rental and purchase inspection</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. SEARCH SECTION */}
      <section className="relative z-20 -mt-16 max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100/60 premium-shadow">
          {/* Tab Buttons */}
          <div className="flex gap-4 mb-6 border-b border-slate-100 pb-4">
            <button
              onClick={() => setActiveSearchTab('rent')}
              className={`pb-3 font-bold text-sm uppercase tracking-wider transition-colors duration-200 relative ${
                activeSearchTab === 'rent' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Rent a Vehicle
              {activeSearchTab === 'rent' && (
                <motion.div layoutId="searchActiveBorder" className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => setActiveSearchTab('buy')}
              className={`pb-3 font-bold text-sm uppercase tracking-wider transition-colors duration-200 relative ${
                activeSearchTab === 'buy' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Buy Used Cars
              {activeSearchTab === 'buy' && (
                <motion.div layoutId="searchActiveBorder" className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
              )}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FaMapMarkerAlt className="text-blue-500" /> {activeSearchTab === 'rent' ? 'Pickup Location' : 'Location'}
              </label>
              <input
                type="text"
                placeholder="City or Airport..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold text-slate-800 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FaCar className="text-blue-500" /> Brand / Maker
              </label>
              <select
                value={searchBrand}
                onChange={(e) => setSearchBrand(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold text-slate-800 bg-slate-50 appearance-none"
              >
                <option value="">All Brands</option>
                <option value="Porsche">Porsche</option>
                <option value="Tesla">Tesla</option>
                <option value="BMW">BMW</option>
                <option value="Mercedes">Mercedes</option>
                <option value="Audi">Audi</option>
                <option value="Lamborghini">Lamborghini</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FaTag className="text-blue-500" /> {activeSearchTab === 'rent' ? 'Daily Budget' : 'Max Price'}
              </label>
              <select
                value={searchBudget}
                onChange={(e) => setSearchBudget(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold text-slate-800 bg-slate-50 appearance-none"
              >
                <option value="">No Limit</option>
                {activeSearchTab === 'rent' ? (
                  <>
                    <option value="20000">Under ₹20,000/day</option>
                    <option value="45000">Under ₹45,000/day</option>
                    <option value="75000">Under ₹75,000/day</option>
                  </>
                ) : (
                  <>
                    <option value="5000000">Under ₹50 Lakh</option>
                    <option value="10000000">Under ₹1 Crore</option>
                    <option value="35000000">Under ₹3.5 Crore</option>
                  </>
                )}
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 text-sm shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <FaSearch /> Find Vehicles
            </button>
          </form>
        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Core Offerings"
          title="Premium Services Tailored For You"
          subtitle="Whether you need speed for a weekend, a permanent new addition, or immediate value for your trade-in, we have you covered."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Rent */}
          <motion.div
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-md flex flex-col items-start hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
            <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 mb-6 font-display font-black text-xl">01</div>
            <h3 className="text-2xl font-bold font-display text-slate-900 mb-4">Rent a Premium Car</h3>
            <p className="text-slate-500 leading-relaxed mb-6">
              Access an elite fleet of sports cars, luxury cruisers, and high-performance electric vehicles. Daily, weekly, and custom travel options.
            </p>
            <Link
              to="/rent"
              className="mt-auto text-blue-600 font-bold text-sm inline-flex items-center gap-2 hover:translate-x-1.5 transition-transform"
            >
              Book Rental Now &rarr;
            </Link>
          </motion.div>

          {/* Card 2: Buy */}
          <motion.div
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-md flex flex-col items-start hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
            <div className="p-4 bg-amber-50 rounded-2xl text-amber-600 mb-6 font-display font-black text-xl">02</div>
            <h3 className="text-2xl font-bold font-display text-slate-900 mb-4">Buy Used Certified</h3>
            <p className="text-slate-500 leading-relaxed mb-6">
              Browse thoroughly inspected, pre-owned cars from private owners and certified local dealers. Transparent pricing, secure communication.
            </p>
            <Link
              to="/buy"
              className="mt-auto text-amber-600 font-bold text-sm inline-flex items-center gap-2 hover:translate-x-1.5 transition-transform"
            >
              Explore Inventory &rarr;
            </Link>
          </motion.div>

          {/* Card 3: Sell */}
          <motion.div
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-md flex flex-col items-start hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
            <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 mb-6 font-display font-black text-xl">03</div>
            <h3 className="text-2xl font-bold font-display text-slate-900 mb-4">Sell Your Vehicle</h3>
            <p className="text-slate-500 leading-relaxed mb-6">
              Create a premium vehicle listing in minutes. Guide buyers via customized specification forms, upload high-res galleries, and get top valuation.
            </p>
            <Link
              to="/sell"
              className="mt-auto text-emerald-600 font-bold text-sm inline-flex items-center gap-2 hover:translate-x-1.5 transition-transform"
            >
              Create Free Listing &rarr;
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 4. FEATURED RENTAL CARS */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Luxury Fleet"
            title="Featured Rental Vehicles"
            subtitle="Book high-performance models by the day. Meticulously inspected, sanitised, and ready to roll."
          />

          <div className="mt-8">
            <Swiper
              modules={[Pagination, Navigation, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              pagination={{ clickable: true }}
              navigation={true}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
              className="pb-16 pt-2"
            >
              {rentalCars.slice(0, 6).map((car) => (
                <SwiperSlide key={car.id}>
                  <RentalCard car={car} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* 5. FEATURED USED CARS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl text-left">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide bg-blue-100 text-blue-800 mb-4 uppercase">
              Certified Pre-Owned
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-slate-900">
              Hot Used Listings
            </h2>
            <p className="text-lg text-slate-500 mt-2">
              Explore recent models uploaded by verified users. Filter by parameters to find your exact driver configuration.
            </p>
          </div>
          <Link
            to="/buy"
            className="mt-4 md:mt-0 px-6 py-3 border-2 border-slate-900 hover:bg-slate-900 hover:text-white font-bold rounded-2xl transition-all duration-300 text-sm whitespace-nowrap self-start md:self-end"
          >
            View All {usedCars.length} Cars
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {usedCars.slice(0, 6).map((car) => (
            <UsedCarCard key={car.id} car={car} />
          ))}
        </div>
      </section>

      {/* 6. WHY CHOOSE US */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeader
            badge="The DriveHub Edge"
            title="Engineered For Transparency"
            subtitle="We are rewriting the rules of the road by establishing trusted transaction pathways."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 hover:border-blue-600/50 transition-colors duration-300">
              <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
                <FaUserShield className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3">Absolute Trust</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Every user identity is verified. Professional used cars feature comprehensive digital condition checks and history logs.
              </p>
            </div>

            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 hover:border-blue-600/50 transition-colors duration-300">
              <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
                <FaCheckCircle className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3">Certified Quality</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                All vehicles uploaded undergo meticulous data validation. Rent with assurance, purchase with safety.
              </p>
            </div>

            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 hover:border-blue-600/50 transition-colors duration-300">
              <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
                <FaHeadset className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3">24/7 Road Support</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Renting a vehicle? Our roadside support team and emergency dispatch services are active 24/7 across every operational city.
              </p>
            </div>

            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 hover:border-blue-600/50 transition-colors duration-300">
              <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
                <FaBolt className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3">Seamless Process</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Sign documents digitally, submit marketplace listings in minutes, and pay via secure checkouts without paperwork.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BRAND SHOWCASE */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-8">Featured Luxury Brands</span>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-20">
            {brands.map((brand) => (
              <div
                key={brand.name}
                onClick={() => navigate(`/buy?brand=${brand.name}`)}
                className="flex flex-col items-center gap-2 cursor-pointer group"
              >
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-800 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all duration-300 shadow-sm font-black font-display text-sm tracking-tighter">
                  {brand.name === 'Mercedes' ? 'MB' : brand.name === 'Lamborghini' ? 'Lambo' : brand.name}
                </div>
                <span className="text-xs font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. STATISTICS SECTION */}
      <section className="py-24 bg-blue-600 text-white relative overflow-hidden">
        <div className="absolute -bottom-24 -left-24 w-[350px] h-[350px] bg-white/10 rounded-full blur-[80px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <span className="text-5xl md:text-6xl font-black font-display mb-2">
              <StatCounter end={18500} suffix="+" />
            </span>
            <span className="text-sm font-bold uppercase tracking-wider text-blue-100">Happy Customers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-5xl md:text-6xl font-black font-display mb-2">
              <StatCounter end={1200} suffix="+" />
            </span>
            <span className="text-sm font-bold uppercase tracking-wider text-blue-100">Cars Listed & Handled</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-5xl md:text-6xl font-black font-display mb-2">
              <StatCounter end={65} suffix="+" />
            </span>
            <span className="text-sm font-bold uppercase tracking-wider text-blue-100">Operational Cities</span>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Testimonials"
          title="What Our Clients Say"
          subtitle="Real reviews from verified buyers, private sellers, and high-performance renters."
        />

        <div className="mt-8">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={32}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            className="pb-16"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id}>
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-md h-full flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1 mb-4 text-amber-500">
                      {/* Fixed 5-star display, never reordered — index key is safe here. */}
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>&#9733;</span>
                      ))}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed italic mb-6">
                      "{t.comment}"
                    </p>
                  </div>
                  <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
                    <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-slate-100" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                      <span className="text-xs text-blue-600 font-semibold">{t.role}</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* 10. FAQ SECTION */}
      <section className="py-24 bg-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Support Hub"
            title="Frequently Asked Questions"
            subtitle="Got queries about transactions, renting conditions, or selling payouts? Find answers here."
          />

          <div className="mt-12 flex flex-col gap-4">
            {faqData.map((faq, idx) => (
              <div
                key={faq.question}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/50 shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-6 flex justify-between items-center font-bold text-slate-800 text-base md:text-lg focus:outline-none hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.question}</span>
                  <FaChevronDown
                    className={`text-slate-400 transition-transform duration-300 ${
                      openFaqIndex === idx ? 'transform rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openFaqIndex === idx && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 border-t border-slate-100 text-slate-600 text-sm md:text-base leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. CTA BANNER */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[40px] bg-slate-950 text-white overflow-hidden shadow-2xl p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Background overlay */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
          
          <div className="relative z-10 max-w-2xl text-left">
            <h2 className="text-3xl md:text-5xl font-black font-display leading-tight mb-4">
              Ready to sell your current ride for top dollar?
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              List your vehicle on DriveHub completely free. Get exposed to thousands of luxury car buyers, schedule direct test drives, and close sales securely.
            </p>
          </div>
          
          <div className="relative z-10 flex flex-wrap gap-4 shrink-0">
            <Link
              to="/sell"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5"
            >
              List Your Car Free
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-bold rounded-2xl transition-all duration-300"
            >
              Talk to Specialist
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
