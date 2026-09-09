import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// Route guards
import ProtectedRoute from '../components/guards/ProtectedRoute';
import AdminRoute from '../components/guards/AdminRoute';
import { ROLES } from '../constants/roles';
import { ROUTES } from '../constants/routes';

// ── Public / Shared pages ─────────────────────────────────────────────────
// These load eagerly — they're what every first-time visitor sees, so they
// stay in the main bundle.
import Home from '../pages/Home';
import RentCars from '../pages/RentCars';
import RentalDetails from '../pages/RentalDetails';
import BuyCars from '../pages/BuyCars';
import BuyCarDetails from '../pages/BuyCarDetails';
import SellCar from '../pages/SellCar';
import Booking from '../pages/Booking';
import About from '../pages/About';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';

// ── Auth pages (standalone — no layout wrapper) ───────────────────────────
import Login from '../pages/Login';
import Register from '../pages/Register';

// ── Customer-only pages ───────────────────────────────────────────────────
import Profile from '../pages/Profile';

// ── Admin pages ───────────────────────────────────────────────────────────
// Code-split: the admin dashboard pulls in Recharts and a dozen
// Framer-Motion-heavy screens that a regular visitor never sees. Lazy
// loading this whole subtree keeps it out of the public homepage bundle.
const AdminLayout = lazy(() => import('../layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const CarsManagement = lazy(() => import('../pages/admin/CarsManagement'));
const BookingsManagement = lazy(() => import('../pages/admin/BookingsManagement'));
const SellRequests = lazy(() => import('../pages/admin/SellRequests'));
const UsersManagement = lazy(() => import('../pages/admin/UsersManagement'));
const AdminAnalytics = lazy(() => import('../pages/admin/AdminAnalytics'));
const FeaturedCars = lazy(() => import('../pages/admin/FeaturedCars'));
const AdminReviews = lazy(() => import('../pages/admin/AdminReviews'));
const AdminNotifications = lazy(() => import('../pages/admin/AdminNotifications'));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'));

const AdminLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// AppRoutes
// ─────────────────────────────────────────────────────────────────────────────

const AppRoutes = () => {
  return (
    <Routes>

      {/* ── Public Routes inside MainLayout (Navbar + Footer) ──────────── */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="rent" element={<RentCars />} />
        <Route path="rent/:id" element={<RentalDetails />} />
        <Route path="buy" element={<BuyCars />} />
        <Route path="buy/:id" element={<BuyCarDetails />} />
        <Route path="sell" element={<SellCar />} />
        <Route path="booking" element={<Booking />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />

        {/* Customer-only: My Profile & Bookings — requires any logged-in user */}
        <Route
          path="profile"
          element={
            <ProtectedRoute requiredRole={ROLES.CUSTOMER}>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ── Auth Pages (no layout wrapper, full-screen standalone) ──────── */}
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />

      {/* ── Unauthorized (logged in, wrong role) ─────────────────────────── */}
      <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />

      {/* ── Protected Admin Routes ─────────────────────────────────────── */}
      {/*
        AdminRoute ensures:
          • Unauthenticated users     → /login
          • Authenticated non-admins  → /unauthorized (clean, explicit message)
          • Admins                    → render AdminLayout with nested route pages
      */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Suspense fallback={<AdminLoadingFallback />}>
              <AdminLayout />
            </Suspense>
          </AdminRoute>
        }
      >
        {/* Index redirect: /admin → /admin/dashboard */}
        <Route index element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="cars" element={<CarsManagement />} />
        <Route path="bookings" element={<BookingsManagement />} />
        <Route path="sell-requests" element={<SellRequests />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="featured" element={<FeaturedCars />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* ── Convenience aliases ────────────────────────────────────────── */}
      {/*
        If a user types /dashboard in the URL bar:
          - The Navigate sends them to /admin/dashboard
          - AdminRoute then checks their role
          - Non-admins are sent to /unauthorized — no dashboard access
      */}
      <Route path="/dashboard" element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />} />
      <Route path="/dashboard/*" element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />} />
      <Route path="/cars/manage" element={<Navigate to={ROUTES.ADMIN.CARS} replace />} />

      {/* ── 404 Fallback ───────────────────────────────────────────────── */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AppRoutes;
