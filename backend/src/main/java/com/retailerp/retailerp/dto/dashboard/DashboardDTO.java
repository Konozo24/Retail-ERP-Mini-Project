package com.retailerp.retailerp.dto.dashboard;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardDTO {

    private MetricDTO totalRevenue;
    private MetricDTO sales;
    private MetricDTO newCustomers;
    private Integer lowStockItems;

    private List<MonthlyMetricDTO> overview;        // bar chart
    private List<CategoryMetricDTO> topCategories;  // pie chart
}