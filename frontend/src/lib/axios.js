import axios from 'axios';

// Define backend API base URL: Render is Priority #1 for production builds, localhost for dev
const RENDER_BACKEND_URL = "https://backend-3t38.onrender.com/api";
const LOCAL_BACKEND_URL = "http://localhost:5000/api";

const BASE_URL = import.meta.env.VITE_API_URL 
    ? (import.meta.env.VITE_API_URL.endsWith('/api') ? import.meta.env.VITE_API_URL : `${import.meta.env.VITE_API_URL}/api`)
    : (import.meta.env.MODE === 'development' ? LOCAL_BACKEND_URL : RENDER_BACKEND_URL);

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

// Add a request interceptor to include the auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
