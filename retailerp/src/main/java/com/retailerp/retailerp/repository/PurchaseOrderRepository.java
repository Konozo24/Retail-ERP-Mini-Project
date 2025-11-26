package com.retailerp.retailerp.repository;

import com.retailerp.retailerp.model.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

    // Find orders by status (e.g., "PENDING" or "COMPLETED")
    List<PurchaseOrder> findByStatus(String status);
    
    // Find all orders from a specific supplier
    List<PurchaseOrder> findBySupplierId(Long supplierId);
}