import API from "./api";
import { useMutation, useQueryClient } from '@tanstack/react-query';

// CREATE SALES ORDER (POST /sales-order)
export function useCreateSalesOrder() {
	const qc = useQueryClient();
	return useMutation({
		/**
		 * @param {{ customerId: string, items: Array<{ productId: string, qty: number }> }} payload
		*/
		mutationFn: (payload) => API.post(`/sales-order`, payload),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['products'], exact: false });
			qc.invalidateQueries({ queryKey: ['salesStats'], exact: false });
			qc.invalidateQueries({ queryKey: ['dashboardStats'], exact: true });
		},
		onError: (error) => {
			console.error("Error creating sales order", error);
		}
	});
}
