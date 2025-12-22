import API from "./api";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

// GET PAGINATED USERS (GET /users)
export function useGetUsersPage(specsPayload) {
	return useQuery({
		queryKey: ['users', specsPayload],
		queryFn: () => API.get(`/users`, {
			params: specsPayload
		}),
		placeholderData: keepPreviousData
	});
}

// GET USER BY ID (GET /users/{userId})
export function useGetUser(userId) {
	return useQuery({
		queryKey: ['user', userId],
		queryFn: () => API.get(`/users/${userId}`),
		enabled: !!userId,
	});
}

// UPDATE USER (PUT /users/{userId})
export function useUpdateUser() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ userId, payload }) => API.put(`/users/${userId}`, payload),
		onSuccess: (_, { userId }) => {
			qc.invalidateQueries({ queryKey: ['users'], exact: false });
			qc.invalidateQueries({ queryKey: ['user', userId], exact: true });
			qc.invalidateQueries({ queryKey: ['dashboardStats'], exact: true });
		},
		onError: (error) => {
			console.error("Error updating user", error);
		}
	});
}
