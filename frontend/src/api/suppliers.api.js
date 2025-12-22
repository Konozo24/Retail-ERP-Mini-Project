import API from "./api";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

// GET PAGINATED SUPPLIERS (GET /suppliers)
export function useGetSuppliersPage(specsPayload) {
	return useQuery({
		queryKey: ['suppliers', specsPayload],
		queryFn: () => API.get(`/suppliers`, {
			params: specsPayload
		}),
		placeholderData: keepPreviousData
	});
}

// CREATE SUPPLIER (POST /suppliers)
export function useCreateSupplier() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload) => API.post(`/suppliers`, payload),
		onSuccess: () => qc.invalidateQueries({ queryKey: ['suppliers'], exact: false }),
		onError: (error) => {
			console.error("Error creating supplier", error);
		}
	});
}

// UPDATE SUPPLIER (PUT /suppliers/{supplierId})
export function useUpdateSupplier() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ supplierId, payload }) => API.put(`/suppliers/${supplierId}`, payload),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['suppliers'], exact: false });
		},
		onError: (error) => {
			console.error("Error updating supplier", error);
		}
	});
}

// DELETE SUPPLIER (DELETE /suppliers/{supplierId})
export function useDeleteSupplier() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (supplierId) => API.delete(`/suppliers/${supplierId}`),
		onSuccess: () => qc.invalidateQueries({ queryKey: ['suppliers'], exact: false }),
		onError: (error) => {
			console.error("Error deleting supplier", error);
		}
	});
}
