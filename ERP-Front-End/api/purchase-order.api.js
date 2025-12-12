import API from "./api";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// GET ALL PURCHASE ORDERS (GET /purchase-order)
export function getPurchaseOrders() {
  return useQuery({
    queryKey: ['purchaseOrders'],
    queryFn: () => API.get(`/purchase-order`),
  });
}

// GET PURCHASE ORDER BY ID (GET /purchase-order/{purchaseOrderId})
export function getPurchaseOrder(purchaseOrderId) {
  return useQuery({
    queryKey: ['purchaseOrder', purchaseOrderId],
    queryFn: () => API.get(`/purchase-order/${purchaseOrderId}`),
    enabled: !!purchaseOrderId,
  });
}

// CREATE PURCHASE ORDER (POST /purchase-order)
export function addPurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => API.post(`/purchase-order`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['purchaseOrders'] }),
  });
}

// UPDATE PURCHASE ORDER (PUT /purchase-order/{purchaseOrderId})
export function updatePurchaseOrder(purchaseOrderId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => API.put(`/purchase-order/${purchaseOrderId}`, payload),
    onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['purchaseOrders'] });
        qc.invalidateQueries({ queryKey: ['purchaseOrder', purchaseOrderId] });
    },
  });
}

// DELETE PURCHASE ORDER (DELETE /purchase-order/{purchaseOrderId})
export function deletePurchaseOrder(purchaseOrderId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => API.delete(`/purchase-order/${purchaseOrderId}`),
    onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['purchaseOrders'] });
        qc.invalidateQueries({ queryKey: ['purchaseOrder', purchaseOrderId] });
    },
  });
}
