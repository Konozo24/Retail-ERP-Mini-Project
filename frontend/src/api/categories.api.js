import API from "./api";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

// GET ALL CATEGORIES (GET /categories)
export function useGetCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => API.get(`/categories`),
    });
}

// GET ALL CATEGORIES (GET /categories/name-list)
export function useGetCategoriesName() {
    return useQuery({
        queryKey: ['categoriesName'],
        queryFn: () => {
            return API.get(`/categories/name-list`)?.names || []
        },
    });
}

// GET CATEGORY BY ID (GET /categories/{categoryId})
export function useGetProduct(categoryId) {
    return useQuery({
        queryKey: ['category', categoryId],
        queryFn: () => API.get(`/categories/${categoryId}`),
        enabled: !!categoryId,
    });
}

// CREATE CATEGORY (POST /categories)
export function useCreateProduct() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload) => API.post(`/categories`, payload),
        onSuccess: () => {
            qc.invalidateQueries({
                predicate: (query) => query.queryKey[0].startsWith('products')
            });
            qc.invalidateQueries({ queryKey: ['dashboard'] });
            qc.invalidateQueries({ queryKey: ['categories'] });
        },
    });
}

// UPDATE CATEGORY (PUT /categories/{categoryId})
export function useUpdateProduct() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ categoryId, payload }) => API.put(`/categories/${categoryId}`, payload),
        onSuccess: (_, { categoryId }) => {
            qc.invalidateQueries({
                predicate: (query) => query.queryKey[0].startsWith('products')
            });
            qc.invalidateQueries({ queryKey: ['dashboard'] });
            qc.invalidateQueries({ queryKey: ['category', categoryId] });
            qc.invalidateQueries({ queryKey: ['categories'] });
        },
    });
}

// DELETE CATEGORY (DELETE /categories/{categoryId})
export function useDeleteProduct() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (categoryId) => API.delete(`/categories/${categoryId}`),
        onSuccess: (_, categoryId) => {
            qc.invalidateQueries({
                predicate: (query) => query.queryKey[0].startsWith('products')
            });

            qc.invalidateQueries({ queryKey: ['dashboard'] });
            qc.invalidateQueries({ queryKey: ['category', categoryId] });
            qc.invalidateQueries({ queryKey: ['categories'] });
        },
    });
}
