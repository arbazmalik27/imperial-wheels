import { Link } from 'react-router-dom';
import { FaCar, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to the Imperial Wheels Newsletter!');
  };

  return (
    <footer className="bg-slate-950 text-slate-400 font-sans border-t border-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white transition-transform group-hover:rotate-12 duration-300">
              <FaCar className="text-xl" />
            </div>
            <span className="text-2xl font-black font-display tracking-tight text-white">
              Imperial<span className="text-blue-500"> Wheels</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-slate-400 mt-2">
            The premier premium automotive portal where driving dreams come true. Experience seamless luxury car rentals and hassle-free buying or selling of pre-owned high-performance vehicles.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="#" className="p-2.5 bg-slate-900 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-300" aria-label="Facebook">
              <FaFacebookF className="text-sm" />
            </a>
            <a href="#" className="p-2.5 bg-slate-900 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-300" aria-label="Twitter">
              <FaTwitter className="text-sm" />
            </a>
            <a href="#" className="p-2.5 bg-slate-900 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-300" aria-label="Instagram">
              <FaInstagram className="text-sm" />
            </a>
            <a href="#" className="p-2.5 bg-slate-900 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-300" aria-label="LinkedIn">
              <FaLinkedinIn className="text-sm" />
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h3 className="text-white text-base font-bold font-display tracking-wide uppercase mb-6">Quick Links</h3>
          <ul className="flex flex-col gap-3.5 text-sm">
            <li>
              <Link to="/" className="hover:text-blue-500 transition-colors duration-200">Home Page</Link>
            </li>
            <li>
              <Link to="/rent" className="hover:text-blue-500 transition-colors duration-200">Rent Luxury Cars</Link>
            </li>
            <li>
              <Link to="/buy" className="hover:text-blue-500 transition-colors duration-200">Buy Used Cars</Link>
            </li>
            <li>
              <Link to="/sell" className="hover:text-blue-500 transition-colors duration-200">Sell Your Car</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-500 transition-colors duration-200">About Imperial Wheels</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-500 transition-colors duration-200">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div>
          <h3 className="text-white text-base font-bold font-display tracking-wide uppercase mb-6">Contact Info</h3>
          <ul className="flex flex-col gap-4 text-sm">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-blue-500 text-lg mt-0.5" />
              <span>Nanda ki chowki, Prem-Nagar,<br />Dehradun, Uttarakhand 248007</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-blue-500 text-base" />
              <span>+91-75127-16271 </span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-blue-500 text-base" />
              <span>support@imperialwheels.example</span>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div>
          <h3 className="text-white text-base font-bold font-display tracking-wide uppercase mb-6">Newsletter</h3>
          <p className="text-sm leading-relaxed text-slate-400 mb-4">
            Subscribe to receive updates on new arrivals, exclusive rental discounts, and marketplace news.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 text-sm shadow-md shadow-blue-600/10"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          &copy; {new Date().getFullYear()} Imperial Wheels Inc. All rights reserved. Built for luxury.
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-blue-500 transition-colors">Cookie Settings</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
