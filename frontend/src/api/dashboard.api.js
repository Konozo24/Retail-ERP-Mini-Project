import API from "./api";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// GET ALL CUSTOMERS (GET /customers)
export function useGetDashboardStatistics() {
  return useQuery({
    queryKey: ['dashboard'], //['customers', 'products', 'purchaseOrders', 'salesOrders'],
    queryFn: () => API.get(`/dashboard/statistics`),
  });
}