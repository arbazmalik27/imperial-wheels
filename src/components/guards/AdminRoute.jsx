import ProtectedRoute from './ProtectedRoute';
import { ROLES } from '../../constants/roles';

/**
 * AdminRoute — convenience wrapper for admin-only routes. All the actual
 * guard logic (redirect-to-login, redirect-to-unauthorized) lives in
 * ProtectedRoute so there's one place to update it.
 */
const AdminRoute = ({ children }) => (
  <ProtectedRoute requiredRole={ROLES.ADMIN}>{children}</ProtectedRoute>
);

export default AdminRoute;
