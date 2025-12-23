import axios from 'axios';

const API = axios.create({
	baseURL: 'http://localhost:8080',
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true,
});

const refreshUserToken = async (originalRequest) => {
	try {
		const data = await API.post('/auth/refresh');
		const token = data.access_token;

		// Store in the same location as before
		if (localStorage.getItem('access_token')) {
			localStorage.setItem('access_token', token);
		} else if (sessionStorage.getItem('access_token')) {
			sessionStorage.setItem('access_token', token);
		}

		originalRequest.headers.Authorization = `Bearer ${token}`;
		return API(originalRequest);
	} catch (err) {
		window.location.href = '/login';
		localStorage.removeItem('access_token');
		sessionStorage.removeItem('access_token');
		return Promise.reject(err);
	}
}

API.interceptors.request.use((config) => {
	const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

API.interceptors.response.use(
	(response) => response.data,
	async (error) => {
		const originalRequest = error.config;
		const hasToken = !!(localStorage.getItem('access_token') || sessionStorage.getItem('access_token'));
		const isForgotPasswordFlow = originalRequest?.url?.includes('/forgot-password/');

		if (error.response?.status === 401 && hasToken && !isForgotPasswordFlow && !originalRequest._retry) {
			originalRequest._retry = true;
			return await refreshUserToken(originalRequest);
		}
		return Promise.reject(error);
	}
);


export default API;
