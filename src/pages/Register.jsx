import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCar,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowRight,
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { usePageMeta } from '../hooks/usePageMeta';

// ─────────────────────────────────────────────────────────────────────────────
// Validation helpers
// ─────────────────────────────────────────────────────────────────────────────

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const validate = ({ name, email, password, confirm }) => {
  if (!name.trim()) return 'Full name is required.';
  if (name.trim().length < 2) return 'Name must be at least 2 characters.';
  if (!email.trim()) return 'Email address is required.';
  if (!isValidEmail(email)) return 'Please enter a valid email address.';
  if (!password) return 'Password is required.';
  if (password.length < 6) return 'Password must be at least 6 characters.';
  if (password !== confirm) return 'Passwords do not match.';
  return null; // no error
};

// ─────────────────────────────────────────────────────────────────────────────
// Password strength indicator
// ─────────────────────────────────────────────────────────────────────────────

const getStrength = (pw) => {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0–5
};

const strengthLabel = ['', 'Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = [
  '',
  'bg-red-500',
  'bg-orange-400',
  'bg-amber-400',
  'bg-blue-500',
  'bg-emerald-500',
];
const strengthText = [
  '',
  'text-red-400',
  'text-orange-400',
  'text-amber-400',
  'text-blue-400',
  'text-emerald-400',
];

// ─────────────────────────────────────────────────────────────────────────────
// Register Page
// ─────────────────────────────────────────────────────────────────────────────

const Register = () => {
  usePageMeta('Create Account | Imperial Wheels');

  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = getStrength(form.password);

  // ── Field change handler ─────────────────────────────────────────────────
  const handleChange = (e) => {
    setError('');
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validate(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    // Simulate a brief network delay for UX realism
    await new Promise((r) => setTimeout(r, 700));

    const result = register(form.name, form.email, form.password);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      // Redirect to home after short celebration pause
      setTimeout(() => navigate('/', { replace: true }), 1200);
    } else {
      setError(result.error);
    }
  };

  // ── Quick-fill demo ──────────────────────────────────────────────────────
  const fillDemo = () => {
    const ts = Date.now().toString().slice(-4);
    setForm({
      name: 'Demo User',
      email: `demo${ts}@example.com`,
      password: 'demo1234',
      confirm: 'demo1234',
    });
    setError('');
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex items-center justify-center px-4 py-12">
      {/* Ambient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* ── Logo ── */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
              <FaCar className="text-white text-xl" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              Imperial<span className="text-blue-400">Wheels</span>
            </span>
          </Link>
          <p className="text-slate-400 text-sm mt-3">
            Create your free account to start renting
          </p>
        </div>

        {/* ── Card ── */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

          {/* Demo fill button */}
          <button
            type="button"
            onClick={fillDemo}
            className="w-full mb-6 py-2.5 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold rounded-xl hover:bg-blue-600/30 transition-colors flex items-center justify-center gap-2"
          >
            <FaCar /> Quick Demo Fill
          </button>

          {/* ── Success overlay ── */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center gap-4 z-10"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/30"
                >
                  <FaCheckCircle className="text-white text-3xl" />
                </motion.div>
                <p className="text-white text-xl font-black">Account Created!</p>
                <p className="text-slate-400 text-sm">Redirecting you to home…</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            {/* Global error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm font-medium"
                >
                  <FaExclamationCircle className="flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Full Name */}
            <div>
              <label htmlFor="register-name" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  id="register-name"
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="register-email" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  id="register-email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="register-password" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  id="register-password"
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  required
                  autoComplete="new-password"
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Strength meter */}
              {form.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2"
                >
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div
                        key={s}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                          s <= strength ? strengthColor[strength] : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-[10px] font-bold ${strengthText[strength]}`}>
                    {strengthLabel[strength]}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="register-confirm" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  id="register-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  name="confirm"
                  required
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={form.confirm}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-12 py-3.5 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                    form.confirm && form.confirm !== form.password
                      ? 'border-red-500/40 focus:ring-red-500/30'
                      : form.confirm && form.confirm === form.password
                      ? 'border-emerald-500/40 focus:ring-emerald-500/30'
                      : 'border-white/10 focus:ring-blue-500/50 focus:border-blue-500/50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
                {/* Match indicator */}
                {form.confirm && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-10 top-1/2 -translate-y-1/2"
                  >
                    {form.confirm === form.password ? (
                      <FaCheckCircle className="text-emerald-400 text-sm" />
                    ) : (
                      <FaExclamationCircle className="text-red-400 text-sm" />
                    )}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Submit button */}
            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account…
                </>
              ) : (
                <>
                  Create Account
                  <FaArrowRight className="text-sm" />
                </>
              )}
            </button>
          </form>

          {/* Link to Login */}
          <p className="text-center text-slate-500 text-xs mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>

        {/* Footer note */}
        <p className="text-center text-slate-600 text-xs mt-4">
          By registering you agree to our Terms & Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
