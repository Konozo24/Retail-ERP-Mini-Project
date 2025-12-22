package com.retailerp.retailerp.dto.statistic.dashboard;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardStatDTO {

    private MetricDTO totalRevenue;
    private MetricDTO sales;
    private MetricDTO newCustomers;
    private Integer lowStockItems;

    private List<MonthlyStatDTO> overview;        // bar chart
    private List<TopCategoryDTO> topCategories;  // pie chart
}