package com.retailerp.retailerp.dto.dashboard;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;
import lombok.Builder.Default;

@Getter
@Builder
public class CategoryMetricDTO {

    private String category;
    private BigDecimal total;
    private BigDecimal percentage;

    @Default
    private String color = "#8B5CF6";

}
