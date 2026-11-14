import axios from "axios";

const backendUrl = import.meta.env.VITE_API_URL
    || (import.meta.env.DEV ? "http://localhost:8080" : "");

const api = axios.create({
    baseURL: `${backendUrl.replace(/\/$/, "")}/api`,
    headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
