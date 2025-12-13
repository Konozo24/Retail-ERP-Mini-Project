import API from "./api";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// GET ALL SALES ORDERS (GET /sales-order)
export function useGetSalesOrders() {
  return useQuery({
    queryKey: ['salesOrders'],
    queryFn: () => API.get(`/sales-order`),
  });
}

// GET SALES ORDER BY ID (GET /sales-order/{salesOrderId})
export function useGetSalesOrder(salesOrderId) {
  return useQuery({
    queryKey: ['salesOrder', salesOrderId],
    queryFn: () => API.get(`/sales-order/${salesOrderId}`),
    enabled: !!salesOrderId,
  });
}

// CREATE SALES ORDER (POST /sales-order)
export function useCreateSalesOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => API.post(`/sales-order`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['salesOrders'] }),
  });
}

// UPDATE SALES ORDER (PUT /sales-order/{salesOrderId})
export function useUpdateSalesOrder(salesOrderId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => API.put(`/sales-order/${salesOrderId}`, payload),
    onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['salesOrders'] });
        qc.invalidateQueries({ queryKey: ['salesOrder', salesOrderId] });
    },
  });
}

// DELETE SALES ORDER (DELETE /sales-order/{salesOrderId})
export function useDeleteSalesOrder(salesOrderId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => API.delete(`/sales-order/${salesOrderId}`),
    onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['salesOrders'] });
        qc.invalidateQueries({ queryKey: ['salesOrder', salesOrderId] });
    },
  });
}
