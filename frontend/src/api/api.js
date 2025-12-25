import axios from 'axios';

const API = axios.create({
	baseURL: '/api', //'http://localhost:8080'
	headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
	withCredentials: true,
});

const getToken = () => localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

const setToken = (token) => {
    if (localStorage.getItem('access_token')) localStorage.setItem('access_token', token);
    else sessionStorage.setItem('access_token', token);
};

const refreshUserToken = async (originalRequest) => {
	try {
		const data = await API.post('/auth/refresh');
		const token = data.access_token;

		// Store in the same location as before
		setToken(token)

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
	const token = getToken();
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

API.interceptors.response.use(
	(response) => response.data,
	async (error) => {
		const originalRequest = error.config;
		const hasToken = !!getToken();
		const isForgotPasswordFlow = originalRequest?.url?.includes('/forgot-password/');

		// Network error: no response received
        if (!error.response) {
            console.error("Network error:", error.message);
            alert("Network error. Server might be down or a internet connection issue.");
            return Promise.reject(error);
        }

		// Unauthorized error handling
		if (error.response?.status === 401 && hasToken && !isForgotPasswordFlow && !originalRequest._retry) {
			originalRequest._retry = true;
			return await refreshUserToken(originalRequest);
		}

		// Other response errors
		// alert("Unhandled error")
		// alert(JSON.stringify(error?.response))
		return Promise.reject(error);
	}
);


export default API;
