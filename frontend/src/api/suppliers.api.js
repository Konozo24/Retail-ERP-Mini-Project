import API from "./api";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

// GET ALL SUPPLIERS (GET /suppliers)
export function useGetSuppliersPage(searchQuery, pageNum, pageSize) {
  return useQuery({
    queryKey: ['suppliers', searchQuery, pageNum, pageSize],
    queryFn: () => API.get(`/suppliers`, {
        params: {
            search: searchQuery,
            page: pageNum,
            size: pageSize,
        }
    }),
    placeholderData: keepPreviousData
  });
}

// GET SUPPLIER BY ID (GET /suppliers/{supplierId})
export function useGetSupplier(supplierId) {
  return useQuery({
    queryKey: ['supplier', supplierId],
    queryFn: () => API.get(`/suppliers/${supplierId}`),
    enabled: !!supplierId,
  });
}

// CREATE SUPPLIER (POST /suppliers)
export function useCreateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => API.post(`/suppliers`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['suppliers'] }),
  });
}

// UPDATE SUPPLIER (PUT /suppliers/{supplierId})
export function useUpdateSupplier(supplierId) {
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
export function useDeleteSupplier(supplierId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => API.delete(`/suppliers/${supplierId}`),
    onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['suppliers'] });
        qc.invalidateQueries({ queryKey: ['supplier', supplierId] });
    },
  });
}
