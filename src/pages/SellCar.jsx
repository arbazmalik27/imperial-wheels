import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCar, FaTag, FaImage, FaUser, FaCheck, FaArrowRight, FaArrowLeft, FaUpload, FaTrash } from 'react-icons/fa';
import SectionHeader from '../components/ui/SectionHeader';
import { usePageMeta } from '../hooks/usePageMeta';
import { addSellRequest } from '../utils/dataStore';

const SellCar = () => {
  usePageMeta(
    'Sell Your Car | Imperial Wheels',
    'Get an offer and sell your car through the Imperial Wheels marketplace.'
  );

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Form Fields State
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [fuel, setFuel] = useState('');
  const [transmission, setTransmission] = useState('');
  const [mileage, setMileage] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([
    "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80" // Prefilled dummy preview image
  ]);
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerType, setSellerType] = useState('Private Seller');

  // Success Dialog State
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const handleNext = (e) => {
    e.preventDefault();
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addSellRequest({
      brand,
      model,
      year,
      fuel,
      transmission,
      mileage,
      price,
      condition,
      description,
      sellerName,
      sellerEmail,
      sellerPhone,
      sellerType,
    });
    setIsSuccessOpen(true);
  };

  const handleResetForm = () => {
    setBrand('');
    setModel('');
    setYear('');
    setFuel('');
    setTransmission('');
    setMileage('');
    setPrice('');
    setCondition('');
    setDescription('');
    setSellerName('');
    setSellerEmail('');
    setSellerPhone('');
    setCurrentStep(1);
    setIsSuccessOpen(false);
  };

  // Steps Progress Bar Rendering
  const renderProgressBar = () => {
    return (
      <div className="mb-12 max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between relative">
          {/* Progress bar line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 z-0 rounded-full" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 z-0 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />

          {/* Steps nodes */}
          {[1, 2, 3, 4, 5].map((step) => {
            const stepIcons = [<FaCar />, <FaTag />, <FaImage />, <FaUser />, <FaCheck />];
            const isActive = currentStep >= step;
            const isCurrent = currentStep === step;

            return (
              <div key={step} className="flex flex-col items-center z-10 relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-110 shadow-lg shadow-blue-500/20'
                      : isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-400 border-2 border-slate-200'
                  }`}
                >
                  {currentStep > step ? <FaCheck className="text-xs" /> : stepIcons[step - 1]}
                </div>
                <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider mt-2 hidden sm:inline ${
                  isCurrent ? 'text-blue-600' : 'text-slate-400'
                }`}>
                  {step === 1 ? 'Vehicle' : step === 2 ? 'Pricing' : step === 3 ? 'Gallery' : step === 4 ? 'Seller' : 'Review'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <SectionHeader 
          badge="Sell Your Vehicle"
          title="List Your Used Car for Sale"
          subtitle="Complete our high-fidelity specification wizard to submit your vehicle listing to our buyers."
        />

        {/* Multi-step progress bar */}
        {renderProgressBar()}

        {/* Wizard Form Wrapper */}
        <div className="bg-white rounded-[32px] p-6 md:p-10 border border-slate-100 shadow-xl premium-shadow">
          <form onSubmit={currentStep === totalSteps ? handleSubmit : handleNext}>
            <AnimatePresence mode="wait">
              
              {/* STEP 1: VEHICLE INFORMATION */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-6"
                >
                  <h3 className="text-xl font-bold font-display text-slate-900 border-b border-slate-100 pb-3">
                    01. Vehicle Information
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="sell-brand" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Maker / Brand</label>
                      <select
                        id="sell-brand"
                        required
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold bg-slate-50"
                      >
                        <option value="">Select Brand</option>
                        <option value="BMW">BMW</option>
                        <option value="Audi">Audi</option>
                        <option value="Mercedes">Mercedes</option>
                        <option value="Porsche">Porsche</option>
                        <option value="Tesla">Tesla</option>
                        <option value="Lamborghini">Lamborghini</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="sell-model" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Model Name</label>
                      <input
                        id="sell-model"
                        type="text"
                        required
                        placeholder="e.g. M3 Competiton, Model Y"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold bg-slate-50 text-slate-800"
                      />
                    </div>

                    <div>
                      <label htmlFor="sell-year" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Year of Production</label>
                      <select
                        id="sell-year"
                        required
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold bg-slate-50"
                      >
                        <option value="">Select Year</option>
                        <option value="2019">2019</option>
                        <option value="2020">2020</option>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="sell-mileage" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Mileage (Miles)</label>
                      <input
                        id="sell-mileage"
                        type="number"
                        required
                        placeholder="e.g. 15000"
                        value={mileage}
                        onChange={(e) => setMileage(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold bg-slate-50 text-slate-800"
                      />
                    </div>

                    <div>
                      <label htmlFor="sell-fuel" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Fuel Type</label>
                      <select
                        id="sell-fuel"
                        required
                        value={fuel}
                        onChange={(e) => setFuel(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold bg-slate-50"
                      >
                        <option value="">Select Fuel</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="sell-transmission" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Transmission Type</label>
                      <select
                        id="sell-transmission"
                        required
                        value={transmission}
                        onChange={(e) => setTransmission(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold bg-slate-50"
                      >
                        <option value="">Select Transmission</option>
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: PRICING & DETAILS */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-6"
                >
                  <h3 className="text-xl font-bold font-display text-slate-900 border-b border-slate-100 pb-3">
                    02. Pricing & Description
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="sell-price" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Asking Price (₹ INR)</label>
                      <input
                        id="sell-price"
                        type="number"
                        required
                        placeholder="e.g. 42000"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold bg-slate-50 text-slate-800"
                      />
                    </div>

                    <div>
                      <label htmlFor="sell-condition" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Reported Condition</label>
                      <select
                        id="sell-condition"
                        required
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold bg-slate-50"
                      >
                        <option value="">Select Condition</option>
                        <option value="Mint">Mint (Like New)</option>
                        <option value="Excellent">Excellent</option>
                        <option value="Very Good">Very Good</option>
                        <option value="Good">Good</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="sell-description" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Description & Seller Notes</label>
                    <textarea
                      id="sell-description"
                      required
                      rows="6"
                      placeholder="Detail features, services history, active mods or accessories, modifications, or damages..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold bg-slate-50 text-slate-800"
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 3: UPLOAD VEHICLE IMAGES */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-6"
                >
                  <h3 className="text-xl font-bold font-display text-slate-900 border-b border-slate-100 pb-3">
                    03. Vehicle Gallery Upload
                  </h3>

                  <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100/50 transition-colors">
                    <FaUpload className="text-blue-500 text-4xl mb-4" />
                    <h4 className="text-sm font-bold text-slate-800 mb-1">Drag and drop photos of your vehicle</h4>
                    <p className="text-xs text-slate-400 mb-4">PNG, JPG formats accepted. Max 10MB per file.</p>
                    <button
                      type="button"
                      onClick={() => alert("Image files selected! Mock uploading...")}
                      className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/10 hover:bg-blue-700 transition-colors"
                    >
                      Select Files From PC
                    </button>
                  </div>

                  {/* Thumbnail list */}
                  <div className="flex flex-wrap gap-4 mt-2">
                    {images.map((img) => (
                      <div key={img} className="relative w-24 h-24 rounded-xl overflow-hidden group shadow-sm border border-slate-200 bg-slate-100">
                        <img src={img} alt="Thumbnail preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setImages([])}
                          className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 4: SELLER INFORMATION */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-6"
                >
                  <h3 className="text-xl font-bold font-display text-slate-900 border-b border-slate-100 pb-3">
                    04. Seller Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Seller Type</label>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setSellerType('Private Seller')}
                          className={`flex-1 py-3 text-sm font-bold rounded-xl border transition-all ${
                            sellerType === 'Private Seller'
                              ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          Private Seller
                        </button>
                        <button
                          type="button"
                          onClick={() => setSellerType('Dealer')}
                          className={`flex-1 py-3 text-sm font-bold rounded-xl border transition-all ${
                            sellerType === 'Dealer'
                              ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          Licensed Dealer
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="sell-seller-name" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Full Name</label>
                      <input
                        id="sell-seller-name"
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={sellerName}
                        onChange={(e) => setSellerName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold bg-slate-50 text-slate-800"
                      />
                    </div>

                    <div>
                      <label htmlFor="sell-seller-email" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Email Address</label>
                      <input
                        id="sell-seller-email"
                        type="email"
                        required
                        placeholder="e.g. john@example.com"
                        value={sellerEmail}
                        onChange={(e) => setSellerEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold bg-slate-50 text-slate-800"
                      />
                    </div>

                    <div>
                      <label htmlFor="sell-seller-phone" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Contact Number</label>
                      <input
                        id="sell-seller-phone"
                        type="tel"
                        required
                        placeholder="e.g. +1 (555) 123-4567"
                        value={sellerPhone}
                        onChange={(e) => setSellerPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold bg-slate-50 text-slate-800"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 5: PREVIEW LISTING */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-6"
                >
                  <h3 className="text-xl font-bold font-display text-slate-900 border-b border-slate-100 pb-3">
                    05. Preview Listing
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Rendered Mock Card */}
                    <div>
                      <span className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Live Listing Card Preview</span>
                      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg flex flex-col">
                        <div className="h-48 bg-slate-100">
                          <img src={images[0] || "https://images.unsplash.com/photo-1617788138017-80ad40651399"} alt="Car Preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="p-6">
                          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">{brand || "Brand"}</span>
                          <h4 className="text-xl font-bold text-slate-950 truncate font-display">{model || "Model Name"}</h4>
                          
                          <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-100 my-4 text-slate-500 text-xs font-bold">
                            <div className="text-center">{year || "2024"}</div>
                            <div className="text-center">{(parseInt(mileage, 10) || 0).toLocaleString()} mi</div>
                            <div className="text-center">{fuel || "Petrol"}</div>
                          </div>

                          <div className="flex justify-between items-center mt-2">
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Asking Price</span>
                              <span className="text-xl font-black text-slate-900">₹{(parseInt(price, 10) || 0).toLocaleString()}</span>
                            </div>
                            <span className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl">Previewing</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Summary list */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <span className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Listing Details</span>
                        <ul className="flex flex-col gap-3 text-sm text-slate-600">
                          <li className="flex justify-between border-b border-slate-100 pb-2">
                            <span>Vehicle Specs:</span>
                            <span className="font-bold text-slate-800">{year} {brand} {model}</span>
                          </li>
                          <li className="flex justify-between border-b border-slate-100 pb-2">
                            <span>Mileage & Transmission:</span>
                            <span className="font-bold text-slate-800">{mileage} mi / {transmission}</span>
                          </li>
                          <li className="flex justify-between border-b border-slate-100 pb-2">
                            <span>Condition:</span>
                            <span className="font-bold text-slate-800">{condition}</span>
                          </li>
                          <li className="flex justify-between border-b border-slate-100 pb-2">
                            <span>Asking Price:</span>
                            <span className="font-bold text-slate-900">₹{(parseInt(price, 10) || 0).toLocaleString()}</span>
                          </li>
                          <li className="flex justify-between border-b border-slate-100 pb-2">
                            <span>Seller Details:</span>
                            <span className="font-bold text-slate-800">{sellerName} ({sellerType})</span>
                          </li>
                        </ul>
                      </div>

                      <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-xs text-blue-700 leading-relaxed mt-6">
                        By submitting this listing, you verify that you are the lawful owner of this vehicle, details entered are truthful, and you agree to DriveHub Seller Policies.
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-10 border-t border-slate-100 pt-6">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 border-2 border-slate-200 hover:border-slate-800 hover:text-slate-800 text-slate-500 font-bold rounded-2xl transition-all duration-300 text-sm flex items-center gap-2"
                >
                  <FaArrowLeft /> Previous Step
                </button>
              ) : (
                <div />
              )}

              <button
                type="submit"
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-md shadow-blue-500/10 text-sm flex items-center gap-2 hover:-translate-y-0.5"
              >
                {currentStep === totalSteps ? 'Submit Listing Now' : 'Continue'} <FaArrowRight />
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Success Dialog Animation Modal */}
      <AnimatePresence>
        {isSuccessOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            {/* Dialog Content */}
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-[40px] p-8 md:p-12 max-w-md w-full relative text-center shadow-2xl z-10"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-200">
                <FaCheck className="text-2xl" />
              </div>
              <h3 className="text-2xl font-black font-display text-slate-900 mb-3">Vehicle Listed Successfully!</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Your listing for the <span className="font-bold text-slate-800">{year} {brand} {model}</span> is now processing. Our review specialists will verify details within 24 hours.
              </p>
              <button
                onClick={handleResetForm}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-colors shadow-lg shadow-blue-500/10 text-sm"
              >
                Go Back / List Another Car
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SellCar;
