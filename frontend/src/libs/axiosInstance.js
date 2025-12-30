import axios from 'axios';
import { cookieService } from '../services/cookieService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const API_KEY = import.meta.env.VITE_API_KEY;

// Create axios instance with custom config
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Accept': 'application/json',
        'x-api-key': API_KEY
    },
    withCredentials: true // Important for cookies
});

// Add request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = cookieService.getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Clear auth cookies
            cookieService.clearAuthCookies();

            // Redirect to login
            window.location.href = '/';
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;