package com.retailerp.retailerp.dto.statistic;

import java.math.BigDecimal;

import lombok.Getter;

@Getter
public class StatisticProductDTO {

    private Long productId;
    private String productName;
    private String sku;
    private String categoryName;
    private Integer stockQty;
    private BigDecimal soldQty;
    private BigDecimal soldAmount;

    public StatisticProductDTO(Long productId, String productName, String sku, String categoryName, Integer stockQty, BigDecimal soldQty, BigDecimal soldAmount) {
        this.productId = productId;
        this.productName = productName;
        this.sku = sku;
        this.categoryName = categoryName;
        this.stockQty = stockQty;
        this.soldQty = soldQty;
        this.soldAmount = soldAmount;
    }
}
