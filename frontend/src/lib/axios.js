import axios from 'axios';

// Define the base URL. It will use the environment variable if available,
// otherwise it defaults to localhost for development.
// For Render, you can either provide VITE_API_URL in your render environment variables, 
// or once you get your Render backend URL, uncomment and replace the demo link below:
// const RENDER_BACKEND_URL = "https://your-demo-backend-url.onrender.com/api";

const BASE_URL = import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api` 
    : 'http://localhost:5000/api';

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
