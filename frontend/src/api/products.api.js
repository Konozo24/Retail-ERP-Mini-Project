import API from "./api";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

// GET ALL PRODUCTS (GET /products)
export function useGetProductsPage(searchQuery, pageNum, pageSize, category) {
    return useQuery({
        queryKey: ['products', searchQuery, pageNum, pageSize, category],
        queryFn: () => API.get(`/products`, {
            params: {
                search: searchQuery,
                page: pageNum,
                size: pageSize,
                category: category
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

// GET LOW STOCK PRODUCTS (GET /products/low-stock)
export function useGetLowStockProducts(searchQuery, pageNum, pageSize, category) {
    return useQuery({
        queryKey: ['products-low-stock', searchQuery, pageNum, pageSize, category],
        queryFn: () => API.get(`/products/low-stock`, {
            params: {
                search: searchQuery,
                page: pageNum,
                size: pageSize,
                category: category
            }
        }),
        placeholderData: keepPreviousData
    });
}

// GET OUT OF STOCK PRODUCTS (GET /products/out-of-stock)
export function useGetOutOfStockProducts(searchQuery, pageNum, pageSize, category) {
    return useQuery({
        queryKey: ['products-out-of-stock', searchQuery, pageNum, pageSize, category],
        queryFn: () => API.get(`/products/out-of-stock`, {
            params: {
                search: searchQuery,
                page: pageNum,
                size: pageSize,
                category: category
            }
        }),
        placeholderData: keepPreviousData
    });
}

// CREATE PRODUCT (POST /products)
export function useCreateProduct() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload) => API.post(`/products`, payload),
        onSuccess: () => {
            qc.invalidateQueries({
                predicate: (query) => query.queryKey[0].startsWith('products')
            });
            qc.invalidateQueries({ queryKey: ['dashboard'] });
            qc.invalidateQueries({ queryKey: ['categories'] });
        },
    });
}

// UPDATE PRODUCT (PUT /products/{productId})
export function useUpdateProduct() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ productId, payload }) => API.put(`/products/${productId}`, payload),
        onSuccess: (_, { productId }) => {
            qc.invalidateQueries({
                predicate: (query) => query.queryKey[0].startsWith('products')
            });
            qc.invalidateQueries({ queryKey: ['dashboard'] });
            qc.invalidateQueries({ queryKey: ['product', productId] });
            qc.invalidateQueries({ queryKey: ['categories'] });
        },
    });
}

// DELETE PRODUCT (DELETE /products/{productId})
export function useDeleteProduct() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (productId) => API.delete(`/products/${productId}`),
        onSuccess: (_, productId) => {
            qc.invalidateQueries({
                predicate: (query) => query.queryKey[0].startsWith('products')
            });

            qc.invalidateQueries({ queryKey: ['dashboard'] });
            qc.invalidateQueries({ queryKey: ['product', productId] });
            qc.invalidateQueries({ queryKey: ['categories'] });
        },
    });
}
