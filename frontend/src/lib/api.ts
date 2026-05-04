import axios from 'axios';

const api = axios.create({
  baseURL: 'https://campus-creatives-api.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the JWT token to headers
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authApi = axios.create({
    baseURL: 'https://campus-creatives-api.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
