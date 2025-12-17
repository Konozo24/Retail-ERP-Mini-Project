import API from "./api";
import { useMutation } from '@tanstack/react-query';

// LOGIN USER (POST /users/login)
export function useLoginUser() {
//   const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => API.post('/auth/login', payload),
    //onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
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

// REGISTER USER (POST /users/register)
// export function useRegisterUser() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (payload) => API.post(/auth/register, payload),
//     onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
//   });
// }