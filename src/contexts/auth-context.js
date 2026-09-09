import { createContext } from 'react';

// Raw context object lives in its own file (not a .jsx file with components)
// so that Vite's Fast Refresh can reliably hot-reload both AuthContext.jsx
// (the provider) and hooks/useAuth.js (the consumer hook) without full reloads.
export const AuthContext = createContext(null);
