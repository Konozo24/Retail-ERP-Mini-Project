import API from "./api";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

// GET PAGINATED PURCHASE ORDERS (GET /purchase-order)
export function useGetPurchaseOrdersPage(searchQuery, pageNum, pageSize) {
	return useQuery({
		queryKey: ['purchaseOrders', searchQuery, pageNum, pageSize],
		queryFn: () => API.get(`/purchase-order`, {
			params: {
				search: searchQuery,
				page: pageNum,
				size: pageSize,
			}
		}),
		placeholderData: keepPreviousData
	});
}

// GET PURCHASE ORDER ITEMS PAGE (GET /purchase-order/{purchaseOrderId}/items-page)
export function useGetPurchaseOrderItems(purchaseOrderId, searchQuery, category, pageNum, pageSize) {
	return useQuery({
		queryKey: ['purchaseOrderItems', purchaseOrderId, searchQuery, category, pageNum, pageSize],
		queryFn: () => API.get(`/purchase-order/${purchaseOrderId}/items-page`, {
			params: {
				search: searchQuery,
				category: category,
				page: pageNum,
				size: pageSize
			}
		}),
		enabled: !!purchaseOrderId,
	});
}

// CREATE PURCHASE ORDER (POST /purchase-order)
export function useCreatePurchaseOrder() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload) => API.post(`/purchase-order`, payload),
		onSuccess: () => {
			qc.invalidateQueries({ predicate: query => query.queryKey[0] === 'purchaseOrders' });
		},
		onError: (error) => {
			console.error("Error creating purchase order", error);
		}
	});
}

// UPDATE PURCHASE ORDER (PUT /purchase-order/{purchaseOrderId})
export function useUpdatePurchaseOrder() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ purchaseOrderId, payload, pagination }) => API.put(`/purchase-order/${purchaseOrderId}`, payload),
		onSuccess: (_, { purchaseOrderId, pagination }) => {
			const { searchQuery, pageNum, pageSize } = pagination;
			qc.invalidateQueries({ queryKey: ['purchaseOrders', searchQuery, pageNum, pageSize] });
			qc.invalidateQueries({ queryKey: ['purchaseOrder', purchaseOrderId] });

			qc.invalidateQueries({ 
				predicate: query => query.queryKey[0] === 'purchaseOrderItems' && 
					query.queryKey[1] === purchaseOrderId
			});
		},
		onError: (error) => {
			console.error("Error updating purchase order", error);
		}
	});
}
