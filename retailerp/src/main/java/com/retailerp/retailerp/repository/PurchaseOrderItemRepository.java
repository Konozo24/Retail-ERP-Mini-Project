package com.retailerp.retailerp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.retailerp.retailerp.model.PurchaseOrderItem;
import java.util.List;

public interface PurchaseOrderItemRepository extends JpaRepository<PurchaseOrderItem, Long> {

    // Find all items belonging to a specific Purchase Order ID
    List<PurchaseOrderItem> findByPurchaseOrderId(Long purchaseOrderId);

    
}