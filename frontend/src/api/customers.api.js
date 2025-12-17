import API from "./api";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

// GET ALL CUSTOMERS (GET /customers)
export function useGetCustomersPage(searchQuery, pageNum, pageSize) {
  return useQuery({
    queryKey: ['customers', searchQuery, pageNum, pageSize],
    queryFn: () => API.get(`/customers`, {
        params: {
            search: searchQuery,
            page: pageNum,
            size: pageSize,
        }
    }),
    placeholderData: keepPreviousData
  });
}

// GET CUSTOMER BY ID (GET /customers/{customerId})
export function useGetCustomer(customerId) {
  return useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => API.get(`/customers/${customerId}`),
    enabled: !!customerId,
  });
}

// CREATE CUSTOMER (POST /customers)
export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => API.post(`/customers`, payload),
    onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['dashboard'] });
        qc.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

// UPDATE CUSTOMER (PUT /customers/{customerId})
export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({customerId, payload}) => API.put(`/customers/${customerId}`, payload),
    onSuccess: (_, {customerId}) => {
        qc.invalidateQueries({ queryKey: ['customers'] });
        qc.invalidateQueries({ queryKey: ['customer', customerId] });
    },
  });
}

// DELETE CUSTOMER (DELETE /customers/{customerId})
export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (customerId) => API.delete(`/customers/${customerId}`),
    onSuccess: (_, customerId) => {
        qc.invalidateQueries({ queryKey: ['dashboard'] });
        qc.invalidateQueries({ queryKey: ['customers'] });
        qc.invalidateQueries({ queryKey: ['customer', customerId] });
    },
  });
}
