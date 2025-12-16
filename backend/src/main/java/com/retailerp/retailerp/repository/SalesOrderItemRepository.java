package com.retailerp.retailerp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.retailerp.retailerp.model.SalesOrderItem;

@Repository
public interface SalesOrderItemRepository extends JpaRepository<SalesOrderItem, Long>, JpaSpecificationExecutor<SalesOrderItem> {
}
