package com.retailerp.retailerp.dto.purchases;

import java.math.BigDecimal;
import java.util.List;

import com.retailerp.retailerp.dto.product.ProductDTO;
import com.retailerp.retailerp.model.PurchaseOrderItem;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PurchaseOrderItemDTO {
    
    private Long id;
    private ProductDTO product;
    private Integer quantity;
    private BigDecimal unitCost;
    private BigDecimal subtotal;
    
    public static PurchaseOrderItemDTO fromEntity(PurchaseOrderItem purchaseOrderItem) {
        return PurchaseOrderItemDTO.builder()
            .id(purchaseOrderItem.getId())
            .product(ProductDTO.fromEntity(purchaseOrderItem.getProduct()))
            .quantity(purchaseOrderItem.getQuantity())
            .unitCost(purchaseOrderItem.getUnitCost())
            .subtotal(purchaseOrderItem.getSubtotal())
            .build();
    }

    public static List<PurchaseOrderItemDTO> fromEntities(List<PurchaseOrderItem> purchaseOrderItems) {
        return purchaseOrderItems.stream()
            .map(PurchaseOrderItemDTO::fromEntity)
            .toList();
    }
}
