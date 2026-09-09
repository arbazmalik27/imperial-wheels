// dataStore.js - Central data management using localStorage
import { rentalCars } from './dummyData';
import { STORAGE_KEYS } from '../constants/storageKeys';

const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

/**
 * Safe JSON.parse with fallback. A single corrupted/manually-edited
 * localStorage value shouldn't be able to crash the whole page — if
 * parsing fails, we fall back to an empty/default value instead of
 * throwing (mirrors the same helper in AuthContext.jsx).
 */
const safeParse = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

// ─── NOTIFICATIONS ──────────────────────────────────────────────────────────
export const getNotifications = () => safeParse(STORAGE_KEYS.NOTIFICATIONS, []);
export const addNotification = (notification) => {
  const notifs = getNotifications();
  const newNotif = {
    id: generateId('notif'),
    ...notification,
    time: new Date().toISOString(),
    read: false,
  };
  notifs.unshift(newNotif);
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  return newNotif;
};
export const markNotificationRead = (id) => {
  const notifs = getNotifications().map(n => n.id === id ? { ...n, read: true } : n);
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
};
export const markAllNotificationsRead = () => {
  const notifs = getNotifications().map(n => ({ ...n, read: true }));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
};
export const clearNotifications = () => localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));

// ─── BOOKINGS ────────────────────────────────────────────────────────────────
export const getBookings = () => safeParse(STORAGE_KEYS.BOOKINGS, []);
export const addBooking = (booking) => {
  const bookings = getBookings();
  const newBooking = {
    id: generateId('BK'),
    ...booking,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };
  bookings.unshift(newBooking);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  // Add notification
  addNotification({ type: 'booking', icon: '📅', message: `New booking by ${booking.customerName} for ${booking.carName}`, category: 'Booking' });
  return newBooking;
};
export const updateBookingStatus = (id, status) => {
  const bookings = getBookings().map(b => b.id === id ? { ...b, status } : b);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
};
export const deleteBooking = (id) => {
  const bookings = getBookings().filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
};

// ─── SELL REQUESTS ───────────────────────────────────────────────────────────
export const getSellRequests = () => safeParse(STORAGE_KEYS.SELL_REQUESTS, []);
export const addSellRequest = (request) => {
  const requests = getSellRequests();
  const newReq = {
    id: generateId('SR'),
    ...request,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };
  requests.unshift(newReq);
  localStorage.setItem(STORAGE_KEYS.SELL_REQUESTS, JSON.stringify(requests));
  addNotification({ type: 'sell', icon: '🚗', message: `New sell request: ${request.year} ${request.brand} ${request.model} by ${request.sellerName}`, category: 'Sell Request' });
  return newReq;
};
export const updateSellRequestStatus = (id, status) => {
  const requests = getSellRequests().map(r => r.id === id ? { ...r, status } : r);
  localStorage.setItem(STORAGE_KEYS.SELL_REQUESTS, JSON.stringify(requests));
};

// ─── CONTACT QUERIES ─────────────────────────────────────────────────────────
export const getContactQueries = () => safeParse(STORAGE_KEYS.CONTACT_QUERIES, []);
export const addContactQuery = (query) => {
  const queries = getContactQueries();
  const newQuery = {
    id: generateId('CQ'),
    ...query,
    createdAt: new Date().toISOString(),
    status: 'New',
  };
  queries.unshift(newQuery);
  localStorage.setItem(STORAGE_KEYS.CONTACT_QUERIES, JSON.stringify(queries));
  addNotification({ type: 'contact', icon: '💬', message: `New contact inquiry from ${query.name}: "${query.subject}"`, category: 'Contact' });
  return newQuery;
};

// ─── USERS ───────────────────────────────────────────────────────────────────
export const getUsers = () => safeParse(STORAGE_KEYS.USERS, []);
export const updateUserStatus = (id, status) => {
  const users = getUsers().map(u => u.id === id ? { ...u, status } : u);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};
export const deleteUser = (id) => {
  const users = getUsers().filter(u => u.id !== id);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};
export const getUserBookings = (userId) => getBookings().filter(b => b.userId === userId);

// ─── CARS ─────────────────────────────────────────────────────────────────────
export const getCars = () => {
  let cars = safeParse(STORAGE_KEYS.ADMIN_CARS, null);
  if (!cars) {
    cars = rentalCars.map(c => ({ ...c, status: 'Available', featured: false }));
    localStorage.setItem(STORAGE_KEYS.ADMIN_CARS, JSON.stringify(cars));
  }
  return cars;
};
export const setCars = (cars) => localStorage.setItem(STORAGE_KEYS.ADMIN_CARS, JSON.stringify(cars));
export const addCar = (car) => {
  const cars = getCars() || [];
  const newCar = {
    id: generateId('car'),
    ...car,
    status: 'Available',
    featured: false,
    createdAt: new Date().toISOString(),
    rating: 4.5,
    reviewsCount: 0,
  };
  cars.unshift(newCar);
  setCars(cars);
  return newCar;
};
export const updateCar = (id, updates) => {
  const cars = (getCars() || []).map(c => c.id === id ? { ...c, ...updates } : c);
  setCars(cars);
};
export const deleteCar = (id) => {
  const cars = (getCars() || []).filter(c => c.id !== id);
  setCars(cars);
};

// ─── SETTINGS ────────────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  websiteName: 'Imperial Wheels',
  contactEmail: 'support@imperialwheels.com',
  phone: '+91-75127-16271',
  address: 'Nanda ki chowki, Prem-Nagar, Dehradun, Uttarakhand 248007',
  facebook: '#',
  twitter: '#',
  instagram: '#',
  linkedin: '#',
  tagline: 'Luxury Car Rental & Marketplace',
};
export const getSettings = () => safeParse(STORAGE_KEYS.SITE_SETTINGS, DEFAULT_SETTINGS);
export const saveSettings = (settings) => localStorage.setItem(STORAGE_KEYS.SITE_SETTINGS, JSON.stringify(settings));

// ─── ANALYTICS DATA (mock time-series) ───────────────────────────────────────
export const getAnalyticsData = () => {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const bookings = getBookings();
  const users = getUsers();
  const cars = getCars() || [];

  const revenueMap = {};
  const bookingsMap = {};
  const usersMap = {};

  months.forEach(m => {
    revenueMap[m] = 0;
    bookingsMap[m] = 0;
    usersMap[m] = 0;
  });

  bookings.forEach(b => {
    const dateStr = b.createdAt || b.pickupDate;
    if (dateStr) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        const mName = months[date.getMonth()];
        bookingsMap[mName] = (bookingsMap[mName] || 0) + 1;
        if (b.status === 'Completed' || b.status === 'Active' || b.status === 'Approved') {
          revenueMap[mName] = (revenueMap[mName] || 0) + (b.totalPrice || 0);
        }
      }
    }
  });

  users.forEach(u => {
    const dateStr = u.joinDate;
    if (dateStr) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        const mName = months[date.getMonth()];
        usersMap[mName] = (usersMap[mName] || 0) + 1;
      }
    }
  });

  const categoryCounts = {};
  cars.forEach(c => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });
  const totalCars = cars.length || 1;
  const categories = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    value: Math.round((count / totalCars) * 100)
  }));

  return {
    revenue: months.map(m => ({ month: m, revenue: revenueMap[m] })),
    bookings: months.map(m => ({ month: m, bookings: bookingsMap[m] })),
    users: months.map(m => ({ month: m, users: usersMap[m] })),
    categories: categories.length > 0 ? categories : [
      { name: 'Sports', value: 35 },
      { name: 'SUV', value: 25 },
      { name: 'Electric', value: 20 },
      { name: 'Luxury', value: 15 },
      { name: 'Convertible', value: 5 },
    ],
  };
};

// ─── SEED INITIAL DATA ────────────────────────────────────────────────────────
export const seedInitialData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS_SEEDED)) {
    const sampleBookings = [
      { id: 'BK-001', customerName: 'Priya Sharma', customerEmail: 'priya@example.com', phone: '+91-87654-32109', carName: 'Porsche 911 Carrera S', carId: 'r1', pickupDate: '2026-06-20', returnDate: '2026-06-25', totalPrice: 302500, status: 'Pending', userId: 'u003', pickupLocation: 'Mumbai Airport', createdAt: '2026-06-14T10:00:00Z' },
      { id: 'BK-002', customerName: 'Rahul Verma', customerEmail: 'rahul@example.com', phone: '+91-76543-21098', carName: 'Tesla Model S Plaid', carId: 'r2', pickupDate: '2026-06-18', returnDate: '2026-06-21', totalPrice: 103680, status: 'Approved', userId: 'u004', pickupLocation: 'Delhi Hub', createdAt: '2026-06-13T14:30:00Z' },
      { id: 'BK-003', customerName: 'Anjali Mehta', customerEmail: 'anjali@example.com', phone: '+91-65432-10987', carName: 'BMW M4 Competition', carId: 'r3', pickupDate: '2026-06-15', returnDate: '2026-06-17', totalPrice: 82080, status: 'Active', userId: 'u005', pickupLocation: 'Bangalore City', createdAt: '2026-06-12T09:15:00Z' },
      { id: 'BK-004', customerName: 'Karan Singh', customerEmail: 'karan@example.com', phone: '+91-54321-09876', carName: 'Mercedes-AMG GT Roadster', carId: 'r4', pickupDate: '2026-06-10', returnDate: '2026-06-12', totalPrice: 140400, status: 'Completed', userId: 'u006', pickupLocation: 'Pune Station', createdAt: '2026-06-09T16:45:00Z' },
      { id: 'BK-005', customerName: 'Sneha Patel', customerEmail: 'sneha@example.com', phone: '+91-43210-98765', carName: 'Lamborghini Huracan Evo', carId: 'r5', pickupDate: '2026-06-25', returnDate: '2026-06-28', totalPrice: 291600, status: 'Pending', userId: 'u007', pickupLocation: 'Chennai Airport', createdAt: '2026-06-14T08:30:00Z' },
      { id: 'BK-006', customerName: 'John Doe', customerEmail: 'john@example.com', phone: '+91-98765-43210', carName: 'Tesla Model Y Performance', carId: 'r12', pickupDate: '2026-03-05', returnDate: '2026-03-10', totalPrice: 90150, status: 'Completed', userId: 'u002', pickupLocation: 'Delhi Hub', createdAt: '2026-03-04T12:00:00Z' },
      { id: 'BK-007', customerName: 'Anjali Mehta', customerEmail: 'anjali@example.com', phone: '+91-65432-10987', carName: 'Range Rover Sport SVR', carId: 'r7', pickupDate: '2026-04-12', returnDate: '2026-04-16', totalPrice: 140150, status: 'Completed', userId: 'u005', pickupLocation: 'Bangalore City', createdAt: '2026-04-11T14:00:00Z' },
      { id: 'BK-008', customerName: 'Priya Sharma', customerEmail: 'priya@example.com', phone: '+91-87654-32109', carName: 'Lamborghini Huracan Evo', carId: 'r5', pickupDate: '2026-05-18', returnDate: '2026-05-20', totalPrice: 180150, status: 'Completed', userId: 'u003', pickupLocation: 'Mumbai Airport', createdAt: '2026-05-17T10:00:00Z' },
      { id: 'BK-009', customerName: 'Karan Singh', customerEmail: 'karan@example.com', phone: '+91-54321-09876', carName: 'Porsche Taycan Turbo S', carId: 'r8', pickupDate: '2026-05-25', returnDate: '2026-05-29', totalPrice: 192150, status: 'Completed', userId: 'u006', pickupLocation: 'Pune Station', createdAt: '2026-05-24T16:00:00Z' },
      { id: 'BK-010', customerName: 'John Doe', customerEmail: 'john@example.com', phone: '+91-98765-43210', carName: 'BMW M4 Competition', carId: 'r3', pickupDate: '2026-01-10', returnDate: '2026-01-13', totalPrice: 114150, status: 'Completed', userId: 'u002', pickupLocation: 'Delhi Hub', createdAt: '2026-01-09T11:00:00Z' },
      { id: 'BK-011', customerName: 'Rahul Verma', customerEmail: 'rahul@example.com', phone: '+91-76543-21098', carName: 'Mercedes-AMG GT Roadster', carId: 'r4', pickupDate: '2026-02-15', returnDate: '2026-02-17', totalPrice: 130150, status: 'Completed', userId: 'u004', pickupLocation: 'Mumbai Airport', createdAt: '2026-02-14T09:30:00Z' },
    ];
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(sampleBookings));

    const sampleSellRequests = [
      { id: 'SR-001', sellerName: 'Vikram Nair', sellerEmail: 'vikram@example.com', sellerPhone: '+91-99887-76655', brand: 'BMW', model: '3 Series M Sport', year: '2021', mileage: '24000', price: '4800000', condition: 'Excellent', status: 'Pending', createdAt: '2026-06-13T11:00:00Z' },
      { id: 'SR-002', sellerName: 'Pooja Gupta', sellerEmail: 'pooja@example.com', sellerPhone: '+91-88776-65544', brand: 'Audi', model: 'A5 Sportback', year: '2020', mileage: '38000', price: '4200000', condition: 'Very Good', status: 'Approved', createdAt: '2026-06-10T15:30:00Z' },
    ];
    localStorage.setItem(STORAGE_KEYS.SELL_REQUESTS, JSON.stringify(sampleSellRequests));

    const sampleNotifs = [
      { id: 'notif-1', type: 'booking', icon: '📅', message: 'New booking by Priya Sharma for Porsche 911 Carrera S', category: 'Booking', time: '2026-06-14T10:00:00Z', read: false },
      { id: 'notif-2', type: 'sell', icon: '🚗', message: 'New sell request: 2021 BMW 3 Series M Sport by Vikram Nair', category: 'Sell Request', time: '2026-06-13T11:00:00Z', read: false },
      { id: 'notif-3', type: 'contact', icon: '💬', message: 'New contact inquiry from Anjali: "Test Drive Request"', category: 'Contact', time: '2026-06-12T09:15:00Z', read: true },
      { id: 'notif-4', type: 'booking', icon: '📅', message: 'New booking by Sneha Patel for Lamborghini Huracan Evo', category: 'Booking', time: '2026-06-14T08:30:00Z', read: false },
    ];
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(sampleNotifs));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS_SEEDED, 'true');
  }
};
