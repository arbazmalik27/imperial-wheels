import { Component } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { ROUTES } from '../constants/routes';

/**
 * Top-level error boundary. Catches unexpected render/runtime errors
 * anywhere below it in the tree and shows a clean fallback instead of a
 * white screen. Kept intentionally simple — no error-monitoring service,
 * no stack traces shown to the user (logged to the console for local
 * debugging only).
 */
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Unexpected error caught by ErrorBoundary:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.assign(ROUTES.HOME);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center border border-red-100 shadow-md mb-8">
              <FaExclamationTriangle className="text-3xl" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2">
              Something Went Wrong
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold font-display text-slate-900 mb-4 tracking-tight">
              We hit a bump in the road
            </h1>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8">
              An unexpected error occurred. This has been logged — try heading back
              to the homepage and starting again.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 text-sm"
            >
              Back to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
