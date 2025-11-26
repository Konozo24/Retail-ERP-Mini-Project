package com.retailerp.retailerp.repository;

import com.retailerp.retailerp.model.SalesOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SalesOrderItemRepository extends JpaRepository<SalesOrderItem, Long> {

    // Find all items belonging to a specific Sales Order ID
    List<SalesOrderItem> findBySalesOrderId(Long salesOrderId);
}