import axios from 'axios';
import { cookieService } from '../services/cookieService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const API_KEY = import.meta.env.VITE_API_KEY;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json', // 🔥 INI KUNCI NYA
    'x-api-key': API_KEY
  }
});

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  (config) => {
    const token = cookieService.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      cookieService.clearAuthCookies();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;