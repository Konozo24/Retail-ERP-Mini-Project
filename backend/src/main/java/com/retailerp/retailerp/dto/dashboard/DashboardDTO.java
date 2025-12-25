package com.retailerp.retailerp.dto.dashboard;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardDTO {

    private DashboardMetricDTO totalRevenue;
    private DashboardMetricDTO sales;
    private DashboardMetricDTO newCustomers;
    private Integer lowStockItems;

    private List<DashboardMonthlyMetricDTO> overview;        // bar chart
    private List<DashboardCategoryMetricDTO> topCategories;  // pie chart
}