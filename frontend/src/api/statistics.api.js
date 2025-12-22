import API from "./api";
import { useQuery } from '@tanstack/react-query';

// GET DASHBOARD STATISTICS (GET /statistics/dashboard)
export function useGetDashboardStats() {
	return useQuery({
		queryKey: ['dashboardStats'],
		queryFn: () => API.get(`/statistics/dashboard`),
	});
}

// GET SALES SUMMARY STATISTICS (GET /statistics/sales/summary)
export function useGetSalesSummary(specsPayload) {
	return useQuery({
		queryKey: ['salesStats', specsPayload],
		queryFn: () => API.get(`/statistics/sales/summary`, {
			params: specsPayload
		}),
	});
}

// GET SALES PRODUCTS STATISTICS (GET /statistics/sales/products)
export function useGetSalesProducts(specsPayload) {
	return useQuery({
		queryKey: ['salesStats', specsPayload],
		queryFn: () => API.get(`/statistics/sales/products`, {
			params: specsPayload
		}),
	});
}
