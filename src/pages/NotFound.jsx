import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCarCrash, FaArrowRight } from 'react-icons/fa';
import { usePageMeta } from '../hooks/usePageMeta';

const NotFound = () => {
  usePageMeta('Page Not Found | Imperial Wheels');

  return (
    <div className="min-h-[85vh] bg-slate-50 flex items-center justify-center pt-28 pb-20 px-4">
      <div className="max-w-md w-full text-center flex flex-col items-center">
        {/* Drifting animation icon */}
        <motion.div
          initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
          animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center border border-blue-100 shadow-md mb-8 animate-float"
        >
          <FaCarCrash className="text-5xl" />
        </motion.div>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2"
        >
          Error 404
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl md:text-4xl font-extrabold font-display text-slate-900 mb-4 tracking-tight"
        >
          Lost in the Showroom?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-slate-500 text-sm md:text-base leading-relaxed mb-8"
        >
          The vehicle coordinates or catalog page you are trying to view does not exist. It may have been sold or moved to an archived inventory index.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            to="/"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 text-sm inline-flex items-center gap-2"
          >
            Back to Home Base <FaArrowRight />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
