import API from "./api";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// GET ALL PRODUCTS (GET /products)
export function getProductsAPI() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => API.get(`/products`),
  });
}

// GET PRODUCT BY ID (GET /products/{productId})
export function getProductAPI(productId) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => API.get(`/products/${productId}`),
    enabled: !!productId,
  });
}

// CREATE PRODUCT (POST /products)
export function addProductAPI() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => API.post(`/products`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}

// UPDATE PRODUCT (PUT /products/{productId})
export function updateProductAPI(productId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => API.put(`/products/${productId}`, payload),
    onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['products'] });
        qc.invalidateQueries({ queryKey: ['product', productId] });
    },
  });
}

// DELETE PRODUCT (DELETE /products/{productId})
export function deleteProductAPI(productId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => API.delete(`/products/${productId}`),
    onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['products'] });
        qc.invalidateQueries({ queryKey: ['product', productId] });
    },
  });
}
