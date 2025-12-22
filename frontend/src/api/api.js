import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

const refreshUserToken = async (originalRequest) => {
    try {
        const data = await API.post('/auth/refresh');
        localStorage.setItem('access_token', data.access_token);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return API(originalRequest);
    } catch (err) {
        if (err.response?.status === 400 || err.response?.status === 401) {
            window.location.href = '/login';
            localStorage.removeItem('access_token');
            return Promise.reject(err);
        }
    }
}

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

API.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            return await refreshUserToken(originalRequest);
        }
        return Promise.reject(error);
    }
);


export default API;
