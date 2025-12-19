package com.retailerp.retailerp.dto.product;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

import com.retailerp.retailerp.dto.category.CategoryDTO;
import com.retailerp.retailerp.model.Product;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProductDTO {

    private Long id;
    private String createdBy;
    private String sku;
    private String name;
    private CategoryDTO category;
    private BigDecimal unitPrice;
    private BigDecimal costPrice;
    private Integer stockQty;
    private Integer reorderLevel;
    private String image;
    private String createdAt;
    private String updatedAt;
 
    public static ProductDTO fromEntity(Product product) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d MMM yyyy");
        return ProductDTO.builder()
            .id(product.getId())
            .createdBy(product.getCreatedBy().getEmail())
            .sku(product.getSku())
            .name(product.getName())
            .category(CategoryDTO.fromEntity(product.getCategory()))
            .unitPrice(product.getUnitPrice())
            .costPrice(product.getCostPrice())
            .stockQty(product.getStockQty())
            .reorderLevel(product.getReorderLevel())
            .image(product.getImage())
            .createdAt(product.getCreatedAt().format(formatter))
            .updatedAt(product.getUpdatedAt().format(formatter))
            .build();
    }


}
