package com.retailerp.retailerp.dto.statistic;

import java.math.BigDecimal;

import com.retailerp.retailerp.dto.product.ProductDTO;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StatisticProductDTO {

    private ProductDTO product;
    private BigDecimal soldQty;
    private BigDecimal soldAmount;
    
}
