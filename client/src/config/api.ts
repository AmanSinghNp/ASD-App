/**
 * API Configuration
 * Centralized API URL configuration for the application
 */

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Auth endpoints
  signup: `${API_URL}/api/auth/signup`,
  login: `${API_URL}/api/auth/login`,
  profile: `${API_URL}/api/auth/profile`,
  deleteAccount: `${API_URL}/api/auth/delete`,
  
  // User endpoints
  users: `${API_URL}/api/users`,
  
  // Product endpoints
  products: `${API_URL}/api/products`,
  
  // Cart endpoints
  cart: `${API_URL}/api/cart`,
  
  // Order endpoints
  orders: `${API_URL}/api/orders`,
  myOrders: `${API_URL}/api/orders/my-orders`,
  
  // Analytics endpoints
  analytics: `${API_URL}/api/analytics`,
  
  // Delivery endpoints
  delivery: `${API_URL}/api/delivery`,
  deliverySlots: (date: string) => `${API_URL}/api/delivery/slots?date=${date}`,
  validateAddress: `${API_URL}/api/delivery/validate-address`,
  
  // FAQ endpoints
  faqs: `${API_URL}/api/faqs`,
  
  // Chat endpoints
  chat: `${API_URL}/api/chat`,
  
  // Stock endpoints
  stock: `${API_URL}/api/stock`,
};

