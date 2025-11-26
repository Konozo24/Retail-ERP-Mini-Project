package com.retailerp.retailerp.repository;

import com.retailerp.retailerp.model.SalesOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {

    //+-----------------------------------------------------------------------+
    //| Find all sales made by a specific User (Staff member)                 |
    //+-----------------------------------------------------------------------+
    List<SalesOrder> findByUserId(Long userId);

    //+-----------------------------------------------------------------------+
    //| Find all sales for a specific Customer                                |
    //+-----------------------------------------------------------------------+
    List<SalesOrder> findByCustomerId(Long customerId);
}