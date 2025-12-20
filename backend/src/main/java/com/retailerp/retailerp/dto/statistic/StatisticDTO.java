package com.retailerp.retailerp.dto.statistic;

import java.math.BigDecimal;

import org.springframework.data.domain.Page;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StatisticDTO {
 
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Long totalItemSold;
    private BigDecimal averageOrderValue;

    private Page<StatisticProductDTO> productsStatistic;
}
