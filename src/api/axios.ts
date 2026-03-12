// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || '/api',  // Uses proxy in dev
//   timeout: 10000,
//   withCredentials: true,  // Still needed for Sanctum cookies despite proxy
//   // ...
// });

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  withCredentials: true,  // For Sanctum cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});


// Request interceptor (e.g., CSRF for Sanctum)
api.interceptors.request.use(
  async (config) => {
    // Optional: Fetch CSRF if needed
    if (config.url?.includes('/login') || config.method === 'post') {
      await axios.get('/sanctum/csrf-cookie', { baseURL: config.baseURL, withCredentials: true });
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response.data,  // Auto-return data
  (error) => {
    if (error.response?.status === 419) {
      // CSRF retry logic
      window.location.reload();
    }
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
