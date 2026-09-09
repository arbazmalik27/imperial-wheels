import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

/**
 * ProtectedRoute — blocks access based on an optional required role.
 * This is the single source of truth for route-guarding logic; AdminRoute
 * is a thin convenience wrapper around this component.
 *
 * Auth state is rehydrated synchronously from localStorage (see
 * AuthContext), so there's no separate loading phase to account for here —
 * on the very first render we already know who's logged in.
 *
 * Behaviour:
 *  • Not logged in                → redirect to /login (remembers where the
 *                                    user was headed, for a post-login bounce back)
 *  • Logged in, wrong role        → redirect to /unauthorized
 *  • Logged in, role OK (or none
 *    required)                    → render children
 *
 * @param {'admin'|'customer'} [requiredRole] Role required to view this route.
 *   Omit to allow any logged-in user.
 */
const ProtectedRoute = ({ requiredRole, children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return children;
};

export default ProtectedRoute;
