package com.retailerp.retailerp.dto.statistic;

import java.math.BigDecimal;

import com.retailerp.retailerp.model.Product;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ProductStatisticProjection {
    Product product;
    BigDecimal soldQty;
    BigDecimal soldAmount;
}
