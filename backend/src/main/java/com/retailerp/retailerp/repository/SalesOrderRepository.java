package com.retailerp.retailerp.repository;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.retailerp.retailerp.dto.dashboard.TopCategoryDTO;
import com.retailerp.retailerp.dto.statistic.StatisticProductDTO;
import com.retailerp.retailerp.model.SalesOrder;

@Repository
public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long>, JpaSpecificationExecutor<SalesOrder> {

    // Find all sales made by a specific User (Staff member)                 |
    List<SalesOrder> findByUserId(Long userId);

    // Find all sales for a specific Customer                                |
    List<SalesOrder> findByCustomerId(Long customerId);

    // DASHBOARD / STATISTICS
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
        SELECT new com.retailerp.retailerp.dto.dashboard.TopCategoryDTO(
            soi.product.category.name,
            soi.product.category.color,
            CAST(SUM(soi.quantity) AS java.math.BigDecimal)
        )
        FROM SalesOrderItem soi
        JOIN soi.salesOrder so
        WHERE FUNCTION('YEAR', so.createdAt) = :year
        GROUP BY soi.product.category.name
        ORDER BY SUM(soi.quantity) DESC
    """)
    List<TopCategoryDTO> getTopCategories(int year);

    @Query("""
        SELECT COALESCE(SUM(item.quantity), 0)
        FROM SalesOrder so
        JOIN so.items item
        WHERE so.createdAt BETWEEN :start AND :end
    """)
    Long getItemsSoldBetween(OffsetDateTime start, OffsetDateTime end);

    @Query("""
        SELECT new com.retailerp.retailerp.dto.statistic.StatisticProductDTO(
            p.id,
            p.name,
            p.sku,
            p.category.name,
            p.stockQty,
            CAST(SUM(soi.quantity) AS java.math.BigDecimal),
            CAST(SUM(soi.subtotal) AS java.math.BigDecimal)
        )
        FROM SalesOrderItem soi
        JOIN soi.salesOrder so
        JOIN soi.product p
        WHERE so.createdAt BETWEEN :start AND :end
        AND (:categoryName IS NULL OR p.category.name = :categoryName)
        GROUP BY p.id, p.name, p.sku, p.stockQty
    """)
    Page<StatisticProductDTO> getProductSalesSummary(
        @Param("categoryName") String categoryName,
        @Param("start") OffsetDateTime start,
        @Param("end") OffsetDateTime end,
        Pageable pageable
    );
}
