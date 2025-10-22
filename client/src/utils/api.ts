// Centralized API base URL for the frontend
// Uses Vite env var if provided, falls back to local server default
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiFetch = (path: string, options: RequestInit = {}) => {
  const url = path.startsWith('http') ? path : `${API_URL}${path}`;
  return fetch(url, options);
};

