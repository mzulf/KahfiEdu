import axiosInstance from "../libs/axiosInstance";
import { cookieService } from "./cookieService";

const AuthService = {
    login: async (email, password) => {
        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);

            const response = await axiosInstance.post('/auth/login', formData);

            if (response.data.token && response.data.role) {
                return response.data;
            }
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    register: async (userData) => {
        try {
            const formData = new FormData();
            Object.keys(userData).forEach(key => {
                formData.append(key, userData[key]);
            });

            const response = await axiosInstance.post('/auth/register', formData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getCurrentUser: async () => {
        try {
            const response = await axiosInstance.get('/auth/me');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    forgotPassword: async (email) => {
        try {
            const formData = new FormData();
            formData.append('email', email);

            const response = await axiosInstance.post('/auth/forgot-password', formData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    resetPassword: async (token, newPassword) => {
        try {
            const formData = new FormData();
            formData.append('token', token);
            formData.append('newPassword', newPassword);

            const response = await axiosInstance.post('/auth/reset-password', formData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    isAuthenticated: () => {
        return !!cookieService.getAuthToken();
    }
};

export default AuthService;