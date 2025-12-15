import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; // Import hook

const API = axios.create({
    baseURL: 'http://localhost:8080',
    headers: { 'Content-Type': 'application/json' },
});

// Allow axios to always return data instead full Axios response
API.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const { refreshToken } = useAuth();
        if (error.response?.status === 401) {
            refreshToken();
        }
        return Promise.reject(error);
    }
);

// Optional: JWT token
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('user_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

export default API;
