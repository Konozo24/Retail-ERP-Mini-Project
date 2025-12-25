import API from "./api";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

// GET ALL PURCHASE ORDERS (GET /purchase-order)
export function useGetPurchaseOrdersPage(searchQuery, pageNum, pageSize) {
  return useQuery({
    queryKey: ['purchaseOrders', searchQuery, pageNum, pageSize],
    queryFn: () => API.get(`/purchase-order`, {
        params: {
            search: searchQuery,
            page: pageNum,
            size: pageSize,
        }
    }),
    placeholderData: keepPreviousData
  });
}

// GET PURCHASE ORDER BY ID (GET /purchase-order/{purchaseOrderId})
export function useGetPurchaseOrder(purchaseOrderId) {
  return useQuery({
    queryKey: ['purchaseOrder', purchaseOrderId],
    queryFn: () => API.get(`/purchase-order/${purchaseOrderId}`),
    enabled: !!purchaseOrderId,
  });
}

// GET PURCHASE ORDER ITEMS PAGE (GET /purchase-order/{purchaseOrderId}/items-page)
export function useGetPurchaseOrderItems(purchaseOrderId, searchQuery, category, pageNum, pageSize) {
  return useQuery({
    queryKey: ['purchaseOrderItems', purchaseOrderId, searchQuery, category, pageNum, pageSize],
    queryFn: () => API.get(`/purchase-order/${purchaseOrderId}/items-page`, {
        params: {
            search: searchQuery,
            category: category,
            page: pageNum,
            size: pageSize
        }
    }),
    enabled: !!purchaseOrderId,
  });
}


// CREATE PURCHASE ORDER (POST /purchase-order)
export function useCreatePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => API.post(`/purchase-order`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['purchaseOrders'] }),
  });
}

// UPDATE PURCHASE ORDER (PUT /purchase-order/{purchaseOrderId})
export function useUpdatePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({purchaseOrderId, payload}) => API.put(`/purchase-order/${purchaseOrderId}`, payload),
    onSuccess: (_, {purchaseOrderId}) => {
        qc.invalidateQueries({ queryKey: ['purchaseOrders'] });
        qc.invalidateQueries({ queryKey: ['purchaseOrder', purchaseOrderId] });
    },
  });
}

// DELETE PURCHASE ORDER (DELETE /purchase-order/{purchaseOrderId})
export function useDeletePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (purchaseOrderId) => API.delete(`/purchase-order/${purchaseOrderId}`),
    onSuccess: (_, purchaseOrderId) => {
        qc.invalidateQueries({ queryKey: ['purchaseOrders'] });
        qc.invalidateQueries({ queryKey: ['purchaseOrder', purchaseOrderId] });
    },
  });
}
