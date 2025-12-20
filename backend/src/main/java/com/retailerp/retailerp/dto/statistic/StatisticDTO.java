package com.retailerp.retailerp.dto.statistic;

import java.math.BigDecimal;
import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StatisticDTO {
 
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Long totalItemSold;
    private BigDecimal averageOrderValue;

    private List<StatisticProductDTO> productsStatistic;
}
