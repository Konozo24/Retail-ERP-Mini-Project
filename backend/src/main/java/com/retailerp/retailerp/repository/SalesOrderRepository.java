package com.retailerp.retailerp.repository;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.retailerp.retailerp.model.SalesOrder;

@Repository
public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long>, JpaSpecificationExecutor<SalesOrder> {

    // Find all sales made by a specific User (Staff member)                 |
    List<SalesOrder> findByUserId(Long userId);

    // Find all sales for a specific Customer                                |
    List<SalesOrder> findByCustomerId(Long customerId);

    // DASHBOARD
        @Query("""
        SELECT COALESCE(SUM(so.totalAmount), 0)
        FROM SalesOrder so
        WHERE so.createdAt BETWEEN :start AND :end
    """)
    Optional<BigDecimal> getRevenueBetween(
        OffsetDateTime start,
        OffsetDateTime end
    );

    @Query("""
        SELECT COUNT(so)
        FROM SalesOrder so
        WHERE so.createdAt BETWEEN :start AND :end
    """)
    long countOrdersBetween(
        OffsetDateTime start,
        OffsetDateTime end
    );

    @Query("""
        SELECT MONTH(so.createdAt), SUM(so.totalAmount)
        FROM SalesOrder so
        WHERE YEAR(so.createdAt) = :year
        GROUP BY MONTH(so.createdAt)
    """)
    List<Object[]> getMonthlyRevenue(int year);

    @Query("""
        SELECT soi.product.category, SUM(soi.quantity)
        FROM SalesOrderItem soi
        JOIN soi.salesOrder so
        WHERE YEAR(so.createdAt) = :year
        GROUP BY soi.product.category
        ORDER BY SUM(soi.quantity) DESC
    """)
    List<Object[]> getTopCategories(int year);
}
