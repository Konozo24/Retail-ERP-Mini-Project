import API from "./api";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// GET ALL CUSTOMERS (GET /customers)
export function getCustomersAPI() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: () => API.get(`/customers`),
  });
}

// GET CUSTOMER BY ID (GET /customers/{customerId})
export function getCustomerAPI(customerId) {
  return useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => API.get(`/customers/${customerId}`),
    enabled: !!customerId,
  });
}

// CREATE CUSTOMER (POST /customers)
export function addCustomerAPI() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => API.post(`/customers`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customers'] }),
  });
}

// UPDATE CUSTOMER (PUT /customers/{customerId})
export function updateCustomerAPI(customerId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => API.put(`/customers/${customerId}`, payload),
    onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['customers'] });
        qc.invalidateQueries({ queryKey: ['customer', customerId] });
    },
  });
}

// DELETE CUSTOMER (DELETE /customers/{customerId})
export function deleteCustomerAPI(customerId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => API.delete(`/customers/${customerId}`),
    onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['customers'] });
        qc.invalidateQueries({ queryKey: ['customer', customerId] });
    },
  });
}
