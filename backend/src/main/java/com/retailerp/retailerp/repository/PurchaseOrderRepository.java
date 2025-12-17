package com.retailerp.retailerp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.retailerp.retailerp.model.PurchaseOrder;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long>, JpaSpecificationExecutor<PurchaseOrder> {

    // Find orders by status (e.g., "PENDING" or "DELIVERED")
    List<PurchaseOrder> findByStatus(String status);
    
    // Find all orders from a specific supplier
    List<PurchaseOrder> findBySupplierId(Long supplierId);

}
