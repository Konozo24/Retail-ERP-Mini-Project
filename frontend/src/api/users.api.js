import API from "./api";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

// GET ALL USERS (GET /users)
export function useGetUsersPage(searchQuery, pageNum, pageSize) {
  return useQuery({
    queryKey: ['users', searchQuery, pageNum, pageSize],
    queryFn: () => API.get(`/users`, {
        params: {
            search: searchQuery,
            page: pageNum,
            size: pageSize,
        }
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
    mutationFn: ({userId, payload}) => API.put(`/users/${userId}`, payload),
    onSuccess: (_, {userId}) => {
        qc.invalidateQueries({ queryKey: ['users'] });
        qc.invalidateQueries({ queryKey: ['user', userId] });
    },
  });
}

// DELETE USER (DELETE /users/{userId})
export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId) => API.delete(`/users/${userId}`),
    onSuccess: (_, userId) => {
        qc.invalidateQueries({ queryKey: ['users'] });
        qc.invalidateQueries({ queryKey: ['user', userId] });
    },
  });
}
