import API from "./api";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

// GET ALL CATEGORIES (GET /categories)
export function useGetCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => API.get(`/categories`),
    });
}

// GET ALL CATEGORIES NAME (GET /categories/name-list)
export function useGetCategoriesName() {
    return useQuery({
        queryKey: ['categoriesName'],
        queryFn: () => API.get(`/categories/name-list`).then(data => data.names),
    });
}

// GET CATEGORY BY ID (GET /categories/{categoryId})
export function useGetCategory(categoryId) {
    return useQuery({
        queryKey: ['category', categoryId],
        queryFn: () => API.get(`/categories/${categoryId}`),
        enabled: !!categoryId,
    });
}

// CREATE CATEGORY (POST /categories)
export function useCreateCategory() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload) => API.post(`/categories`, payload),
        onSuccess: () => {
            qc.invalidateQueries({
                predicate: (query) => query.queryKey[0].startsWith('products')
            });
            qc.invalidateQueries({
                predicate: (query) => query.queryKey[0].startsWith('categories')
            });
            qc.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
}

// UPDATE CATEGORY (PUT /categories/{categoryId})
export function useUpdateCategory() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ categoryId, payload }) => API.put(`/categories/${categoryId}`, payload),
        onSuccess: (_, { categoryId }) => {
            qc.invalidateQueries({
                predicate: (query) => query.queryKey[0].startsWith('products')
            });
            qc.invalidateQueries({
                predicate: (query) => query.queryKey[0].startsWith('categories')
            });
            qc.invalidateQueries({ queryKey: ['dashboard'] });
            qc.invalidateQueries({ queryKey: ['category', categoryId] });
        },
    });
}

// DELETE CATEGORY (DELETE /categories/{categoryId})
export function useDeleteCategory() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (categoryId) => API.delete(`/categories/${categoryId}`),
        onSuccess: (_, categoryId) => {
            qc.invalidateQueries({
                predicate: (query) => query.queryKey[0].startsWith('products')
            });
            qc.invalidateQueries({
                predicate: (query) => query.queryKey[0].startsWith('categories')
            });
            qc.invalidateQueries({ queryKey: ['dashboard'] });
            qc.invalidateQueries({ queryKey: ['category', categoryId] });
        },
    });
}
