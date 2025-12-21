package com.retailerp.retailerp.dto.sales;

import java.math.BigDecimal;
import java.util.List;

import com.retailerp.retailerp.dto.product.ProductDTO;
import com.retailerp.retailerp.model.SalesOrderItem;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SalesOrderItemDTO {
    
    private Long id;
    private ProductDTO product;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;

    public static SalesOrderItemDTO fromEntity(SalesOrderItem purchaseOrderItem) {
        return SalesOrderItemDTO.builder()
            .id(purchaseOrderItem.getId())
            .product(ProductDTO.fromEntity(purchaseOrderItem.getProduct()))
            .quantity(purchaseOrderItem.getQuantity())
            .unitPrice(purchaseOrderItem.getUnitPrice())
            .subtotal(purchaseOrderItem.getSubtotal())
            .build();
    }

    public static List<SalesOrderItemDTO> fromEntities(List<SalesOrderItem> purchaseOrderItems) {
        return purchaseOrderItems.stream()
            .map(SalesOrderItemDTO::fromEntity)
            .toList();
    }
}
