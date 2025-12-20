import API from "./api";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

// GET ALL SALES ORDERS (GET /sales-order)
export function useGetSalesOrdersPage(searchQuery, pageNum, pageSize, startDate, endDate) {
  return useQuery({
    queryKey: ['salesOrders', searchQuery, pageNum, pageSize, startDate, endDate],
    
    queryFn: () => API.get(`/sales-order`, {
        params: {
            search: searchQuery,
            page: pageNum,
            size: pageSize,
            
            // Optional Parameters
            startDate: startDate || undefined, 
            endDate: endDate || undefined,
        }
    }),
    placeholderData: keepPreviousData
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
    onSuccess: () => {
        qc.invalidateQueries({
            predicate: (query) => query.queryKey[0].startsWith('salesStatistic')
        });

        qc.invalidateQueries({ queryKey: ['products'] });
        qc.invalidateQueries({ queryKey: ['dashboard'] });
        qc.invalidateQueries({ queryKey: ['salesOrders'] });
    },
  });
}

// // UPDATE SALES ORDER (PUT /sales-order/{salesOrderId})
// export function useUpdateSalesOrder() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: ({salesOrderId, payload}) => API.put(`/sales-order/${salesOrderId}`, payload),
//     onSuccess: (_, {salesOrderId}) => {
//         qc.invalidateQueries({ queryKey: ['dashboard'] });
//         qc.invalidateQueries({ queryKey: ['salesOrders'] });
//         qc.invalidateQueries({ queryKey: ['salesOrder', salesOrderId] });
//     },
//   });
// }

// // DELETE SALES ORDER (DELETE /sales-order/{salesOrderId})
// export function useDeleteSalesOrder() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (salesOrderId) => API.delete(`/sales-order/${salesOrderId}`),
//     onSuccess: (_, salesOrderId) => {
//         qc.invalidateQueries({ queryKey: ['dashboard'] });
//         qc.invalidateQueries({ queryKey: ['salesOrders'] });
//         qc.invalidateQueries({ queryKey: ['salesOrder', salesOrderId] });
//     },
//   });
// }
