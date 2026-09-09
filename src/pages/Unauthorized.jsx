import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import { ROUTES } from '../constants/routes';
import { usePageMeta } from '../hooks/usePageMeta';

/**
 * Shown when a logged-in user tries to reach a route their role doesn't
 * permit (e.g. a customer opening an /admin/* URL directly). Kept minimal
 * and visually consistent with NotFound — this is a demo app with no real
 * backend authorization, so the guard is purely client-side routing.
 */
const Unauthorized = () => {
  usePageMeta('Access Restricted | Imperial Wheels');

  return (
    <div className="min-h-[85vh] bg-slate-50 flex items-center justify-center pt-28 pb-20 px-4">
      <div className="max-w-md w-full text-center flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center border border-amber-100 shadow-md mb-8"
        >
          <FaShieldAlt className="text-4xl" />
        </motion.div>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2"
        >
          Error 403 — Access Restricted
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-extrabold font-display text-slate-900 mb-4 tracking-tight"
        >
          Not Your Lane
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-slate-500 text-sm md:text-base leading-relaxed mb-8"
        >
          You're signed in, but this area is reserved for administrators.
          If you believe this is a mistake, contact support — otherwise, head back to familiar ground.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            to={ROUTES.HOME}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 text-sm inline-flex items-center gap-2"
          >
            Back to Home Base <FaArrowRight />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Unauthorized;
