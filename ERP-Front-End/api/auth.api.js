import API from "./api";
import { useMutation, useQueryClient } from '@tanstack/react-query';

// LOGIN USER (POST /users/login)
export function useLoginUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => API.post(`/users/login`, payload),
    //onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

// REGISTER USER (POST /users/register)
export function useRegisterUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => API.post(`/users/register`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}
