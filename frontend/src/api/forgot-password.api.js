import API from "./api";
import { useMutation } from "@tanstack/react-query";

export function useSendForgotEmail() {
	return useMutation({
		mutationFn: (email) => API.post(`/forgot-password/verifyMail/${encodeURIComponent(email)}`),
	});
}

export function useVerifyOtp() {
	return useMutation({
		mutationFn: ({ email, otp }) => API.post(`/forgot-password/verify-otp/${otp}/${encodeURIComponent(email)}`),
	});
}

export function useChangePassword() {
	return useMutation({
		mutationFn: ({ email, password, repeatPassword }) =>
			API.post(`/forgot-password/changePassword/${encodeURIComponent(email)}`, {
				password,
				repeatPassword,
			}),
	});
}
