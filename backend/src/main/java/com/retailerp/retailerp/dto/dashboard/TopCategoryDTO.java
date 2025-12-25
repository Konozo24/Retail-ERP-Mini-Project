package com.retailerp.retailerp.dto.dashboard;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class TopCategoryDTO{

    private String categoryName;
    private String color;
    private BigDecimal totalQuantity;

}
