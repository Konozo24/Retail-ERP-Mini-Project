import API from "./api";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// GET ALL SUPPLIERS (GET /suppliers)
export function getSuppliers() {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: () => API.get(`/suppliers`),
  });
}

// GET SUPPLIER BY ID (GET /suppliers/{supplierId})
export function getSupplier(supplierId) {
  return useQuery({
    queryKey: ['supplier', supplierId],
    queryFn: () => API.get(`/suppliers/${supplierId}`),
    enabled: !!supplierId,
  });
}

// CREATE SUPPLIER (POST /suppliers)
export function addSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => API.post(`/suppliers`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['suppliers'] }),
  });
}

// UPDATE SUPPLIER (PUT /suppliers/{supplierId})
export function updateSupplier(supplierId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => API.put(`/suppliers/${supplierId}`, payload),
    onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['suppliers'] });
        qc.invalidateQueries({ queryKey: ['supplier', supplierId] });
    },
  });
}

// DELETE SUPPLIER (DELETE /suppliers/{supplierId})
export function deleteSupplier(supplierId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => API.delete(`/suppliers/${supplierId}`),
    onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['suppliers'] });
        qc.invalidateQueries({ queryKey: ['supplier', supplierId] });
    },
  });
}
