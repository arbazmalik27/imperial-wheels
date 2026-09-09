import { useState } from 'react';
import { getSettings, saveSettings } from '../../utils/dataStore';
import { FaSave, FaBuilding, FaLink, FaCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSettings = () => {
  const [settings, setSettings] = useState(() => getSettings());
  const [saved, setSaved] = useState(false);

  const handleChange = (key, value) => setSettings(s => ({ ...s, [key]: value }));

  const handleSave = (e) => {
    e.preventDefault();
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">Settings</h1>
          <p className="text-slate-500 text-sm mt-0.5">Configure your website settings</p>
        </div>
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-md"
            >
              <FaCheck /> Saved!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Settings */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
            <FaBuilding className="text-blue-500" /> Company Information
          </h2>
          <div className="space-y-4">
            {[
              { key: 'websiteName', label: 'Website Name', placeholder: 'Imperial Wheels' },
              { key: 'tagline', label: 'Tagline', placeholder: 'Luxury Car Rental & Marketplace' },
              { key: 'contactEmail', label: 'Contact Email', type: 'email', placeholder: 'support@imperialwheels.com' },
              { key: 'phone', label: 'Phone Number', placeholder: '+91-75127-16271' },
              { key: 'address', label: 'Address', placeholder: 'Your business address' },
            ].map(({ key, label, type = 'text', placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
                <input
                  type={type}
                  value={settings[key] || ''}
                  onChange={e => handleChange(key, e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-slate-50"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
            <FaLink className="text-violet-500" /> Social Media Links
          </h2>
          <div className="space-y-4">
            {['facebook', 'twitter', 'instagram', 'linkedin'].map(key => (
              <div key={key}>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{key}</label>
                <input
                  type="url"
                  value={settings[key] || ''}
                  onChange={e => handleChange(key, e.target.value)}
                  placeholder={`https://${key}.com/yourpage`}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-slate-50"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
        >
          <FaSave /> Save Settings
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
