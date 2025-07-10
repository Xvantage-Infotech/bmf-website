'use client';

import { config } from '@/config/config';
import { getAccessToken } from '@/hooks/cookies';
import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: config.BASE_API,
  // withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn('Unauthorized. Logging out...');
      localStorage.removeItem('token');
      window.location.href = '/login'; // Or use Next.js router if inside a component
    }

    // Other errors (optional logging)
    if (error.response?.status === 400) {
      console.error('Bad Request:', error.message);
    } else if (error.response?.status === 403) {
      console.error('Forbidden:', error.message);
    } else if (error.response?.status === 409) {
      console.error('Conflict:', error.message);
    } else if (!error.response) {
      console.error('Network or Server Down:', error.message);
    }

    return Promise.reject(error);
  }
);

export { api };
