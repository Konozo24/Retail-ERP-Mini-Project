package com.retailerp.retailerp.dto.statistic.dashboard;

import java.math.BigDecimal;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MetricDTO {

	private BigDecimal value;

	private BigDecimal changePercentage;

}
