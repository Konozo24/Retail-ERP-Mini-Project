import API from "./api";
import { useMutation } from '@tanstack/react-query';

// LOGIN USER (POST /auth/login)
export function useLoginUser() {
	return useMutation({
		mutationFn: (payload) => API.post('/auth/login', payload),
	});
}

// LOGOUT USER (POST /auth/logout)
export function useLogoutUser() {
	return useMutation({
		mutationFn: () => API.post('/auth/logout'),
		onSuccess: () => {
			localStorage.removeItem('user');
			localStorage.removeItem('access_token');
			sessionStorage.removeItem('user');
			sessionStorage.removeItem('access_token');
			// optionally, reset React Query cache or redirect user
		},
	});
}
