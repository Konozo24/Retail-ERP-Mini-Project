import API from "./api";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// GET ALL PRODUCTS (GET /products)
export function getProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => API.get(`/products`),
  });
}

// GET PRODUCT BY ID (GET /products/{productId})
export function getProduct(productId) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => API.get(`/products/${productId}`),
    enabled: !!productId,
  });
}

// CREATE PRODUCT (POST /products)
export function addProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => API.post(`/products`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}

// UPDATE PRODUCT (PUT /products/{productId})
export function updateProduct(productId) {
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
export function deleteProduct(productId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => API.delete(`/products/${productId}`),
    onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['products'] });
        qc.invalidateQueries({ queryKey: ['product', productId] });
    },
  });
}
