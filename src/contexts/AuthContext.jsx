import { useState, useEffect } from 'react';
import { AuthContext } from './auth-context';
import { ROLES } from '../constants/roles';
import { STORAGE_KEYS } from '../constants/storageKeys';

// Re-export the context object so existing imports of
// `{ AuthContext }` from this file keep working.
export { AuthContext };

// ─────────────────────────────────────────────────────────────────────────────
// Seed / Demo Users
//
// NOTE: This project has no backend. Authentication is simulated entirely in
// localStorage for portfolio/demo purposes — passwords are stored in plain
// text here on purpose (there's nothing server-side to hash against). Do not
// reuse this pattern in a real application.
// ─────────────────────────────────────────────────────────────────────────────

const DUMMY_USERS = [
  {
    id: 'u001',
    name: 'Admin User',
    email: 'admin@imperialwheels.com',
    password: 'admin123',
    role: ROLES.ADMIN,
    phone: '+91-75127-16271',
    joinDate: '2024-01-15',
    status: 'active',
    avatar: 'AD',
  },
  {
    id: 'u002',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'john123',
    role: ROLES.CUSTOMER,
    phone: '+91-98765-43210',
    joinDate: '2024-03-20',
    status: 'active',
    avatar: 'JD',
  },
  {
    id: 'u003',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'priya123',
    role: ROLES.CUSTOMER,
    phone: '+91-87654-32109',
    joinDate: '2024-04-12',
    status: 'active',
    avatar: 'PS',
  },
  {
    id: 'u004',
    name: 'Rahul Verma',
    email: 'rahul@example.com',
    password: 'rahul123',
    role: ROLES.CUSTOMER,
    phone: '+91-76543-21098',
    joinDate: '2026-05-08',
    status: 'active',
    avatar: 'RV',
  },
  {
    id: 'u005',
    name: 'Anjali Mehta',
    email: 'anjali@example.com',
    password: 'anjali123',
    role: ROLES.CUSTOMER,
    phone: '+91-65432-10987',
    joinDate: '2026-03-10',
    status: 'active',
    avatar: 'AM',
  },
  {
    id: 'u006',
    name: 'Karan Singh',
    email: 'karan@example.com',
    password: 'karan123',
    role: ROLES.CUSTOMER,
    phone: '+91-54321-09876',
    joinDate: '2026-04-15',
    status: 'active',
    avatar: 'KS',
  },
  {
    id: 'u007',
    name: 'Sneha Patel',
    email: 'sneha@example.com',
    password: 'sneha123',
    role: ROLES.CUSTOMER,
    phone: '+91-43210-98765',
    joinDate: '2026-05-20',
    status: 'active',
    avatar: 'SP',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Derive avatar initials from a full name (e.g. "John Doe" → "JD") */
const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2);

/** Generate a simple unique ID */
const generateId = () =>
  `u${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

/** Safe JSON.parse with fallback */
const safeParse = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// AuthProvider
// ─────────────────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }) => {
  // Rehydrate synchronously on first render (no flash of logged-out state,
  // no separate "loading" phase to track — the whole point of a lazy
  // initializer is that this runs before the first paint).
  const [user, setUser] = useState(() => safeParse(STORAGE_KEYS.CURRENT_USER, null));

  // ── Ensure the demo users list is always seeded ────────────────────────────
  useEffect(() => {
    try {
      const storedUsers = safeParse(STORAGE_KEYS.USERS, []);
      if (!Array.isArray(storedUsers) || storedUsers.length === 0) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DUMMY_USERS));
      }
    } catch {
      // localStorage itself is unavailable/broken (e.g. quota exceeded,
      // private browsing). This clears potentially-corrupt auth state in
      // response to that external failure — not deriving state from props,
      // so it's a legitimate use of setState inside an effect.
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DUMMY_USERS));
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(null);
    }
  }, []);

  // ── login ─────────────────────────────────────────────────────────────────
  /**
   * Authenticate a user with email + password.
   * @returns {{ success: boolean, user?: object, error?: string }}
   */
  const login = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    let users = safeParse(STORAGE_KEYS.USERS, DUMMY_USERS);
    if (!Array.isArray(users)) users = DUMMY_USERS;

    const foundUser = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (!foundUser) {
      return { success: false, error: 'No account found with that email.' };
    }
    if (foundUser.status === 'blocked') {
      return { success: false, error: 'Your account has been blocked. Contact support.' };
    }
    if (foundUser.password !== normalizedPassword) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    // Strip password before storing in state / localStorage
    const { password: _password, ...safeUser } = foundUser;
    setUser(safeUser);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));
    return { success: true, user: safeUser };
  };

  // ── register ──────────────────────────────────────────────────────────────
  /**
   * Create a new customer account and auto-login.
   * @param {string} name     Full name
   * @param {string} email    Email address
   * @param {string} password Plain-text password
   * @returns {{ success: boolean, user?: object, error?: string }}
   */
  const register = (name, email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    let users = safeParse(STORAGE_KEYS.USERS, DUMMY_USERS);
    if (!Array.isArray(users)) users = DUMMY_USERS;

    // Duplicate email check
    const exists = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (exists) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    // Build new user object
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    const newUser = {
      id: generateId(),
      name: trimmedName,
      email: normalizedEmail,
      password,             // stored only in the "users" list
      role: ROLES.CUSTOMER, // all self-registered accounts are customers
      phone: '',
      joinDate: today,
      status: 'active',
      avatar: getInitials(trimmedName),
    };

    // Persist user to the list
    const updatedUsers = [...users, newUser];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));

    // Auto-login: strip password before going into state
    const { password: _password, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));

    return { success: true, user: safeUser };
  };

  // ── logout ────────────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  };

  // ── updateUser ───────────────────────────────────────────────────────────
  /**
   * Update the current user's profile fields (name, phone, etc.).
   * Also syncs changes back to the persistent `users` list.
   * @param {object} updates Partial user object (only editable fields)
   * @returns {{ success: boolean, error?: string }}
   */
  const updateUser = (updates) => {
    if (!user) return { success: false, error: 'Not logged in.' };

    try {
      const users = safeParse(STORAGE_KEYS.USERS, []);
      const updatedUsers = users.map((u) =>
        u.id === user.id ? { ...u, ...updates } : u
      );
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));

      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));

      return { success: true };
    } catch {
      return { success: false, error: 'Failed to update profile.' };
    }
  };

  // ── Derived role flags ────────────────────────────────────────────────────
  const isAdmin = user?.role === ROLES.ADMIN;
  const isCustomer = user?.role === ROLES.CUSTOMER;

  // ── Context value ─────────────────────────────────────────────────────────
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        updateUser,
        isAdmin,
        isCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
