import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaEnvelope, FaCar, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../constants/roles';
import { ROUTES } from '../constants/routes';
import { usePageMeta } from '../hooks/usePageMeta';

const Login = () => {
  usePageMeta('Sign In | Imperial Wheels');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || ROUTES.HOME;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      if (result.user.role === ROLES.ADMIN) {
        navigate(ROUTES.ADMIN.DASHBOARD, { replace: true });
      } else {
        navigate(from === ROUTES.ADMIN.DASHBOARD ? ROUTES.HOME : from, { replace: true });
      }
    } else {
      setError(result.error);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') { setEmail('admin@imperialwheels.com'); setPassword('admin123'); }
    else { setEmail('john@example.com'); setPassword('john123'); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex items-center justify-center px-4 py-12">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <FaCar className="text-white text-xl" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              Imperial<span className="text-blue-400">Wheels</span>
            </span>
          </Link>
          <p className="text-slate-400 text-sm mt-3">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          
          {/* Demo credentials buttons */}
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              className="flex-1 py-2.5 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold rounded-xl hover:bg-blue-600/30 transition-colors flex items-center justify-center gap-1.5"
            >
              <FaShieldAlt /> Admin Demo
            </button>
            <button
              type="button"
              onClick={() => fillDemo('customer')}
              className="flex-1 py-2.5 bg-white/5 border border-white/10 text-slate-300 text-xs font-bold rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5"
            >
              <FaCar /> Customer Demo
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label htmlFor="login-email" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} aria-label={showPass ? 'Hide password' : 'Show password'} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing In...</>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-xs mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold">
              Create Account
            </Link>
          </p>
          <p className="text-center text-slate-600 text-xs mt-2">
            Back to website?{' '}
            <Link to="/" className="text-slate-400 hover:text-slate-200 font-semibold">
              Go Home
            </Link>
          </p>
        </div>

        {/* Hint */}
        <p className="text-center text-slate-600 text-xs mt-4">
          Admin: admin@imperialwheels.com / admin123
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
