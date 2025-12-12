package com.retailerp.retailerp.dto.product;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import com.retailerp.retailerp.model.Product;
import com.retailerp.retailerp.model.User;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProductDTO {

    private Long id;
    private User createdBy;
    private String sku;
    private String name;
    private String category;
    private BigDecimal unitPrice;
    private BigDecimal costPrice;
    private Integer stockQty;
    private Integer reorderLevel;
    private OffsetDateTime createdAt;
 
    public static ProductDTO fromEntity(Product product) {
        return ProductDTO.builder()
            .id(product.getId())
            .createdBy(product.getCreatedBy())
            .sku(product.getSku())
            .name(product.getName())
            .category(product.getCategory())
            .unitPrice(product.getUnitPrice())
            .costPrice(product.getCostPrice())
            .stockQty(product.getStockQty())
            .reorderLevel(product.getReorderLevel())
            .createdAt(product.getCreatedAt())
            .build();
    }


}
