import { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPaperPlane, FaCompass } from 'react-icons/fa';
import SectionHeader from '../components/ui/SectionHeader';
import { usePageMeta } from '../hooks/usePageMeta';
import { addContactQuery } from '../utils/dataStore';

const Contact = () => {
  usePageMeta(
    'Contact Imperial Wheels',
    'Get in touch with the Imperial Wheels team for rentals, sales, or support.'
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      addContactQuery({ name, email, subject, message });
      alert(`Thank you, ${name}! Your enquiry has been sent. Our team will contact you back within 12 hours.`);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setIsSending(false);
    }, 800);
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <SectionHeader 
          badge="Get In Touch"
          title="Contact Imperial Wheels"
          subtitle="Do you have queries about listings, luxury corporate accounts, or dealer onboarding? Talk to us."
        />

        {/* Contact Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Column (7 cols): Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-xl premium-shadow">
            <h3 className="text-xl font-bold font-display text-slate-900 border-b border-slate-100 pb-3 mb-6">
              Send Us a Message
            </h3>

            <form onSubmit={handleContactSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Your Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold bg-slate-50 text-slate-800"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="e.g. john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold bg-slate-50 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  placeholder="e.g. Corporate Account Enquiry"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold bg-slate-50 text-slate-800"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Message Content</label>
                <textarea
                  id="contact-message"
                  required
                  rows="5"
                  placeholder="Detail your request, listing ID or questions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold bg-slate-50 text-slate-800"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full sm:w-fit px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-2xl transition-all duration-300 shadow-md shadow-blue-500/10 hover:shadow-lg text-sm flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <FaPaperPlane /> {isSending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Right Column (5 cols): Info & Socials */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Info Cards */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-lg premium-shadow flex flex-col gap-6">
              <h3 className="text-lg font-bold font-display text-slate-900 border-b border-slate-100 pb-3">
                Contact Details
              </h3>

              <div className="flex gap-4 items-start text-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">Office Headquarters</span>
                  <span className="font-bold text-slate-800 mt-1 block">
                    Nanda ki chowki, Prem-Nagar,<br />Dehradun, Uttarakhand 248007
                  </span>
                </div>
              </div>

              <div className="flex gap-4 items-start text-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <FaPhoneAlt />
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">Customer Support Hotline</span>
                  <span className="font-bold text-slate-800 mt-1 block">+91-75127-16271</span>
                </div>
              </div>

              <div className="flex gap-4 items-start text-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <FaEnvelope />
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">General Enquiries Email</span>
                  <span className="font-bold text-slate-800 mt-1 block">support@Imperial Wheels.com</span>
                </div>
              </div>

              <div className="flex gap-4 items-start text-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <FaClock />
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">Operation Hours</span>
                  <span className="font-bold text-slate-800 mt-1 block">Mon - Fri: 8:00 AM - 6:00 PM PST</span>
                </div>
              </div>
            </div>

            {/* Social Connect */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 flex flex-col gap-4">
              <h4 className="font-bold font-display uppercase tracking-wide text-xs text-slate-400">Connect Socially</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Check our official channels for newly listed luxury models, client event photos, and community updates.
              </p>
              <div className="flex gap-3">
                <a href="#" className="p-3 bg-slate-800 hover:bg-blue-600 rounded-xl transition-colors"><FaFacebook className="text-sm" /></a>
                <a href="#" className="p-3 bg-slate-800 hover:bg-blue-600 rounded-xl transition-colors"><FaTwitter className="text-sm" /></a>
                <a href="#" className="p-3 bg-slate-800 hover:bg-blue-600 rounded-xl transition-colors"><FaInstagram className="text-sm" /></a>
                <a href="#" className="p-3 bg-slate-800 hover:bg-blue-600 rounded-xl transition-colors"><FaLinkedin className="text-sm" /></a>
              </div>
            </div>

          </div>

        </div>

        {/* Styled Vector Map Placeholder */}
        <div className="bg-white border border-slate-200/50 rounded-[32px] p-6 shadow-sm">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <FaCompass className="text-blue-500" /> Interactive Office Coordinates
          </h4>
          <div className="relative h-80 rounded-2xl overflow-hidden bg-slate-950/5 border border-slate-200/30 flex items-center justify-center bg-grid-pattern">
            {/* Styled visual vectors representing roads */}
            <div className="absolute inset-0 z-0 opacity-20">
              <div className="absolute top-0 bottom-0 left-1/4 w-4 bg-slate-500 transform rotate-12" />
              <div className="absolute top-0 bottom-0 left-1/2 w-3 bg-slate-500 transform -rotate-45" />
              <div className="absolute left-0 right-0 top-1/3 h-5 bg-slate-500 transform rotate-6" />
              <div className="absolute left-0 right-0 top-2/3 h-3 bg-slate-500 transform -rotate-12" />
            </div>

            {/* Custom map pin */}
            <div className="relative z-10 flex flex-col items-center justify-center animate-bounce">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white shadow-blue-500/30">
                <FaMapMarkerAlt className="text-xl" />
              </div>
              <div className="mt-2 bg-slate-900/90 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-sm shadow-md">
                Imperial Wheels HQ
              </div>
            </div>
            
            <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/50 text-[10px] text-slate-500 font-semibold shadow-sm z-10">
              Dehradun Coordinates &bull; Lat: 30.3165 &deg; N, Long: 78.0322 &deg; E
            </div>
          </div>
        </div>

      </div>  
    </div>
  );
};

export default Contact;
