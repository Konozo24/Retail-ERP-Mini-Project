package com.retailerp.retailerp.dto.dashboard;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardMetricDTO {

    private BigDecimal value;
    private BigDecimal changePercentage;
    
}
