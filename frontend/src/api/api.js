
import axios from "axios";

// API URL configuration
export const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV
        ? ""
        : "https://employee-management-system-production-d17a890a.up.railway.app");

// Create Axios instance
const api = axios.create({
    baseURL: `${API_BASE_URL.replace(/\/+$/, "")}/api`,
    headers: {
        "Content-Type": "application/json"
    }
});

// Attach JWT token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
