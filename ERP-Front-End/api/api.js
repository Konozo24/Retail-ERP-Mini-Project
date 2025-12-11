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
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
