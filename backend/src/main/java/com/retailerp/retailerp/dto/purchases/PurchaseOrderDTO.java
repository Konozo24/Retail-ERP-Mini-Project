package com.retailerp.retailerp.dto.purchases;

import java.time.OffsetDateTime;
import java.util.List;

import com.retailerp.retailerp.model.PurchaseOrder;
import com.retailerp.retailerp.model.PurchaseOrderItem;
import com.retailerp.retailerp.model.Supplier;
import com.retailerp.retailerp.model.User;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PurchaseOrderDTO {

    private Long id;
    private Supplier supplier;
    private User user;
    private String status;
    private OffsetDateTime createdAt;
    private List<PurchaseOrderItem> items;

    public static PurchaseOrderDTO fromEntity(PurchaseOrder purchaseOrder) {
        return PurchaseOrderDTO.builder()
            .id(purchaseOrder.getId())
            .supplier(purchaseOrder.getSupplier())
            .user(purchaseOrder.getUser())
            .status(purchaseOrder.getStatus())
            .createdAt(purchaseOrder.getCreatedAt())
            .items(purchaseOrder.getItems())
            .build();
    }

}
