import API from "./api";
import { useMutation } from '@tanstack/react-query';

// LOGIN USER (POST /users/login)
export function useLoginUser() {
//   const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => API.post(`/auth/login`, payload),
    //onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

// REGISTER USER (POST /users/register)
// export function useRegisterUser() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (payload) => API.post(`/auth/register`, payload),
//     onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
//   });
// }
