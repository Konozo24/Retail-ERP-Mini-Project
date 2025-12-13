import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080',
    headers: { 'Content-Type': 'application/json' },
});

// Allow axios to always return data instead full Axios response
API.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error)
);

// Optional: JWT token
API.interceptors.request.use(
    (config) => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData && userData.token !== null) config.headers.Authorization = `Bearer ${userData.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default API;
