package com.retailerp.retailerp.dto.statistic.sales;

import java.math.BigDecimal;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SalesSummaryDTO {

	private BigDecimal totalRevenue;

	private Integer totalOrders;

	private Integer totalItemSold;

	private BigDecimal averageOrderValue;

}
