import { Salad } from "lucide-react";
import API from "./api";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// GET ALL CUSTOMERS (GET /customers)
export function useGetDashboardStatistics() {
	return useQuery({
		queryKey: ['dashboard'], //['customers', 'products', 'purchaseOrders', 'salesOrders'],
		queryFn: () => API.get(`/dashboard/statistics`),
	});
}

export function useGetSalesStatistics(category, pageNum, pageSize, startDate, endDate) {
	return useQuery({
		queryKey: ['salesStatistic', category, pageNum, pageSize, startDate, endDate],
		queryFn: () => {
			console.log('Fetching sales stats:', {
				category,
				pageNum,
				pageSize,
				startDate,
				endDate,
				'Note': 'Backend expects DD/MM/YYYY format'
			});
			return API.get(`/dashboard/sales`, {
				params: {
					category: category,
					page: pageNum,
					size: pageSize,
					startDate: startDate,
					endDate: endDate
				}
			}).then(result => {
				console.log('Sales stats received:', {
					totalRevenue: result.totalRevenue,
					totalOrders: result.totalOrders,
					totalItemSold: result.totalItemSold,
					productsCount: result.productsStatistic?.content?.length || 0,
					fullResult: result
				});
				return result;
			});
		},
		staleTime: 0, // Always fetch fresh data
		refetchOnMount: 'always', // Refetch when component mounts
		refetchOnWindowFocus: true, // Refetch when window regains focus
	});
}