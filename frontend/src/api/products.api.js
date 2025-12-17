import API from "./api";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

// GET ALL PRODUCTS (GET /products)
export function useGetProductsPage(searchQuery, pageNum, pageSize) {
  return useQuery({
    queryKey: ['products', searchQuery, pageNum, pageSize],
    queryFn: () => API.get(`/products`, {
        params: {
            search: searchQuery,
            page: pageNum,
            size: pageSize,
        }
    }),
    placeholderData: keepPreviousData
  });
}

// GET PRODUCT BY ID (GET /products/{productId})
export function useGetProduct(productId) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => API.get(`/products/${productId}`),
    enabled: !!productId,
  });
}

// CREATE PRODUCT (POST /products)
export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => API.post(`/products`, payload),
    onSuccess: () =>{
        qc.invalidateQueries({ queryKey: ['dashboard'] });
        qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// UPDATE PRODUCT (PUT /products/{productId})
export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({productId, payload}) => API.put(`/products/${productId}`, payload),
    onSuccess: (_, {productId}) => {
        qc.invalidateQueries({ queryKey: ['dashboard'] });
        qc.invalidateQueries({ queryKey: ['products'] });
        qc.invalidateQueries({ queryKey: ['product', productId] });
    },
  });
}

// DELETE PRODUCT (DELETE /products/{productId})
export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId) => API.delete(`/products/${productId}`),
    onSuccess: (_, productId) => {
        qc.invalidateQueries({ queryKey: ['dashboard'] })
        qc.invalidateQueries({ queryKey: ['products'] });
        qc.invalidateQueries({ queryKey: ['product', productId] });
    },
  });
}
