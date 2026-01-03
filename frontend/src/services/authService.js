import axiosInstance from "../libs/axiosInstance";
import { cookieService } from "./cookieService";

const AuthService = {
  login: async (email, password) => {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password
    });
    return response.data;
  },

  register: async (userData) => {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await axiosInstance.post("/auth/forgot-password", {
      email
    });
    return response.data;
  },

  resetPassword: async (token, newPassword, userId) => {
    const response = await axiosInstance.post("/auth/reset-password", {
      token,
      newPassword,
      userId
    });
    return response.data;
  },

  isAuthenticated: () => {
    return !!cookieService.getAuthToken();
  },
};

export default AuthService;
