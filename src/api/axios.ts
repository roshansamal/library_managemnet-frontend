// // import axios from "axios";

// // const api = axios.create({
// //   baseURL: import.meta.env.VITE_API_URL || '/api',  // Uses proxy in dev
// //   timeout: 10000,
// //   withCredentials: true,  // Still needed for Sanctum cookies despite proxy
// //   // ...
// // });

// import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

// const api: AxiosInstance = axios.create({
//   //baseURL: import.meta.env.VITE_API_URL || 'https://localhost:8000/api',
//   baseURL: import.meta.env.VITE_API_URL || 'https://localhost:8000/api',
//   timeout: 10000,
//   withCredentials: true,  // For Sanctum cookies
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
//   }
// });


// // Request interceptor (e.g., CSRF for Sanctum)
// // api.interceptors.request.use(
// //   async (config) => {
// //     // Optional: Fetch CSRF if needed
// //     if (config.url?.includes('/login') || config.method === 'post') {
// //       await axios.get('/sanctum/csrf-cookie', { baseURL: config.baseURL, withCredentials: true });
// //     }
// //     return config;
// //   },
// //   (error) => Promise.reject(error)
// // );

// api.interceptors.request.use(
//   async (config) => {
//     const needsCsrf =
//       config.method === 'post' ||
//       config.method === 'put' ||
//       config.method === 'patch' ||
//       config.method === 'delete';
//     if (needsCsrf) {
//       await api.get('/sanctum/csrf-cookie'); // uses same baseURL + withCredentials
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );


// // Response interceptor
// api.interceptors.response.use(
//   (response: AxiosResponse<AxiosResponse>) => response.data,  // Auto-return data
//   (error) => {
//     if (error.response?.status === 419) {
//       // CSRF retry logic
//       window.location.reload();
//     }
//     if (error.response?.status === 401) {
//       // Redirect to login
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;

// import axios, { AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';


const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://localhost:8000',
  timeout: 10000,
  withCredentials: true,
  withXSRFToken: true,           // for Axios 1.6+ with Sanctum [web:632]
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const method = (config.method ?? 'get').toLowerCase();
    const needsCsrf = ['post', 'put', 'patch', 'delete'].includes(method);

    if (needsCsrf) {
      // hit sanctum with SAME instance (same baseURL+credentials)
      await api.get('/sanctum/csrf-cookie');
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    if (error.response?.status === 419) {
      console.error('CSRF 419 error', error.response.data);
    }
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;
