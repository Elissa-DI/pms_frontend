
/**
 * Frontend Routes
 * This file contains all the routes used in the PMS application.
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Protected Customer routes
  SLOTS: '/slots',
  BOOK: '/book',
  BOOKINGS: '/bookings',
  BOOKING_DETAILS: (id: string) => `/bookings/${id}`,
  PROFILE: '/profile',
  
  // Protected Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_SLOTS: '/admin/slots',
  
  // Error routes
  NOT_FOUND: '*'
};

/**
 * API Endpoints
 * These are the backend endpoints used by the frontend
 */
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    VERIFY_EMAIL: '/api/auth/verify-email',
  },
  
  // User endpoints
  USERS: {
    ME: '/api/users/me',
    ALL: '/api/users',
    SINGLE: (id: string) => `/api/users/${id}`,
  },
  
  // Customer endpoints
  CUSTOMER: {
    SLOTS: '/api/customer/slots',
    BOOKINGS: '/api/customer/bookings',
    BOOKINGS_ME: '/api/customer/bookings/me',
    BOOKING: (id: string) => `/api/customer/bookings/${id}`,
    CANCEL_BOOKING: (id: string) => `/api/customer/bookings/${id}/cancel`,
  },
  
  // Admin endpoints
  ADMIN: {
    SLOTS: '/api/slots',
    SLOT: (id: string) => `/api/slots/${id}`,
    BOOKINGS: '/api/bookings',
    BOOKING: (id: string) => `/api/bookings/${id}`,
  }
};
